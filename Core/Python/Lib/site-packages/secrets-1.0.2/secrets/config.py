#!/usr/bin/env python
"""
Configuration file class for LDAP servers

Example file contents:

[default]
server = ldap://localhost/
admin_dn = cn=manager,dc=example,dc=com
uid_format = uid=%(username)s,%(dn)s

[mail]
description = Mail account password
dn = ou=users,dc=mail,dc=example,dc=com
search_fields = cn
uid_attr = cn

[shell]
description = Shell access password
dn = ou=users,dc=shell,dc=example,dc=com

"""

import os,configobj

DEFAULT_PASSWORD_CONFIG = '/etc/secrets.conf'
DEFAULT_SEARCH_FIELDS = ['uid','gecos']
DEFAULT_UID_ATTR = ['uid']
VALID_CONFIG_FIELDS = [
    'server','dn','admin_dn','uid_format','uid_attr','search_fields','description'
]

class SecretsConfigError(Exception):
    """
    Exception raised by issues with LDAP server or password changes
    """
    def __str__(self):
        return self.args[0]

class SecretsConfig(dict):
    """
    Parser for configuration file of LDAP password servers,
    DN and ADMIN DN values.
    """
    def __init__(self,path=None):
        dict.__init__(self)
        path = path is not None and path or DEFAULT_PASSWORD_CONFIG
        self.__admin_credentials_cache = {}
        self.defaults = {
            'server': 'ldap://localhost/',
            'uid_format': 'uid=%(username)s,%(dn)s',
            'search_fields': DEFAULT_SEARCH_FIELDS,
            'uid_attr': DEFAULT_UID_ATTR,
            'dn': None, 'admin_dn': None,
        }
        if not os.path.isfile(path):
            raise SecretsConfigError('No such file: %s' % path)
        if not os.access(path,os.R_OK):
            raise SecretsConfigError('No permissions to read %s' % path)
        config = configobj.ConfigObj(path,list_values=False,interpolation=False)
        for name,settings in config.items():
            fields = {}
            for k,v in settings.items():
                if k not in VALID_CONFIG_FIELDS:
                    raise SecretsConfigError('Unknown key in configuration: %s' % k)
                v = unicode(v,'utf-8')
                if name == 'default':
                    self.defaults[k] = v
                else:
                    fields[k] = v
            if name == 'default':
                continue

            for k in ['server','dn','admin_dn','uid_format','uid_attr','search_fields']:
                if not fields.has_key(k):
                    fields[k] = self.defaults[k]
            self[name] = SecretsService(name,**fields)

    def save(self,path):
        """
        Save configuration to given path
        """
        config = configobj.ConfigObj(list_values=False,interpolation=False)
        config['default'] = {}
        for k,v in self.defaults.items():
            if v is None: continue
            config['default'][k] = v
        for name,service in self.items():
            config[name] = {}
            for k in VALID_CONFIG_FIELDS:
                v = getattr(service,k)
                if k in self.defaults.keys() and v==self.defaults[k]:
                    continue
                config[name][k] = v
        try:
            config.write(open(path,'w'))
        except IOError,(ecode,emsg):
            raise SecretsConfigError('Error writing %s: %s' % (path,emsg))

    def get_cached_admin_password(self,server):
        """
        Return cached admin DN password or None if not found
        """
        try:
            return self.__admin_credentials_cache[server]
        except KeyError:
            pass
        if os.access('/etc/ldap.secret',os.R_OK):
            return open('/etc/ldap.secret','r').readline().strip()
        return None

    def set_cached_admin_password(self,server,password):
        """
        Stores admin DN password to local cache to be used when
        multiple operatins are requested on same server.
        Always remember to wipe cache with clear_password_cache()
        """
        if self.__admin_credentials_cache.has_key(server):
            # Wipe old value before updating
            for i in enumerate(self.__admin_credentials_cache[server]):
                self.__admin_credentials_cache[server][i] = ''
        self.__admin_credentials_cache[server] = password

    def clear_password_cache(self):
        """
        Clear local admin password cache, overwriting fields with
        empty values before deallocating
        """
        for k,v in self.__admin_credentials_cache.items():
            for i in enumerate(v):
                self.__admin_credentials_cache[k][i] = ''
        self.__admin_credentials_cache.clear()

class SecretsService(object):
    """
    Stores password service configuration entries from SecretsConfig file
    """
    def __init__(self,name,server,dn,admin_dn,uid_format,uid_attr,search_fields,description=None):
        self.name = name
        self.server = server
        self.uid_format = uid_format
        self.uid_attr = uid_attr
        self.dn = dn
        self.admin_dn = admin_dn
        if description is None:
            description = '%s password' % self.name
        self.description = description
        self.search_fields = search_fields

    def __repr__(self):
        return '%s on %s DN %s' % (self.name,self.server,self.dn)

