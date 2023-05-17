#!/usr/bin/env python
"""
Classes to change password on LDAP servers configured
in SecretsConfig
"""

import string,random,base64,ldap
from hashlib import sha1

from secrets.config import SecretsService

class PasswordServiceError(Exception):
    """
    Exceptions raised by errors changing passwords
    """
    def __str__(self):
        return self.args[0]

class PasswordService(object):
    """
    Manage password changes on the SecretsService server
    """
    def __init__(self,service):
        if not isinstance(service,SecretsService):
            raise PasswordServiceError('Not a SecretsService instance: %s' % type(service))
        self.service = service

    def __repr__(self):
        return 'Password change on %s' % self.service

    def __getattr__(self,attr):
        return getattr(self.service,attr)

    def generate_salt(self,chars=None,length=16):
        """
        Generate a random salt. Default length is 16.
        """
        chars = chars is not None and chars or string.letters + string.digits
        salt = ""
        for i in range(int(length)):
            salt += random.choice(chars)
        return salt

    def format_uid(self,username):
        """
        Return UID for username
        """
        return self.service.uid_format % { 'username': username, 'dn': self.service.dn }

    def test_password(self,username,password,admin=False):
        """
        Test login with the password given
        """
        uid = self.format_uid(username)
        session = ldap.initialize(self.service.server)
        try:
            if admin:
                session.simple_bind_s(self.service.admin_dn,password)
            else:
                session.simple_bind_s(uid,password)
        except ldap.UNWILLING_TO_PERFORM:
            return None
        except ldap.INVALID_CREDENTIALS:
            return None
        return session

    def change_password(self,username,new,bind_password,admin=False):
        """
        Change user's password to 'new' for username 'username'
        If admin is False, we try to bind with user credentials,
        otherwise bind_password is admin_dn password.
        """
        if admin:
            session = self.test_password(username,bind_password,admin=True)
        else:
            session = self.test_password(username,bind_password)
        if not session:
            raise PasswordServiceError('Invalid password')

        # Make sure user exists in LDAP
        uid = self.format_uid(username)
        try:
            fields = [x for x in self.service.search_fields]
            if self.service.uid_attr not in fields:
                fields.append(str(self.service.uid_attr))
            info = session.search_s(self.service.dn, ldap.SCOPE_SUBTREE, '(%s=%s)' % (self.service.uid_attr,username), fields )[0]
            info[1][self.service.uid_attr][0]
        except ldap.FILTER_ERROR,emsg:
            raise PasswordServiceError('Error in query: %s' % emsg)
        except KeyError:
            raise PasswordServiceError('Bug in field configuration')
        except IndexError:
            raise PasswordServiceError('User not found from LDAP')

        salt = self.generate_salt()
        # TODO - make this configurable
        pwhash = "{SSHA}" + base64.encodestring(sha1(new+salt).digest() + salt)
        mod_attrs = [ ( ldap.MOD_REPLACE, 'userPassword', pwhash ) ]
        try:
            session.modify_s(uid,mod_attrs)
        except ldap.INVALID_CREDENTIALS,emsg:
            # TODO - check what exceptions actually can be raised here
            raise PasswordServiceError('Error changing password for %s: %s' % (uid,emsg))

