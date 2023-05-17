#!/usr/bin/env python
"""
Package setup script for easy_install

Requires python-openssl package to be installed.
"""

try:
    #noinspection PyUnresolvedReferences
    import OpenSSL
except ImportError:
    raise ImportError('Installing this module requires OpenSSL python bindings')

import os,glob
from setuptools import setup

VERSION='1.0.2'
README = open(os.path.join(os.path.dirname(__file__),'README.md'),'r').read()

setup(
    name = 'secrets',
    version = VERSION,
    license = 'PSF',
    keywords = 'LDAP server password change user management',
    url = 'http://tuohela.net/packages/secrets',
    zip_safe = False,
    packages = ['secrets'],
    scripts = glob.glob('bin/*'),
    install_requires = ['configobj','python-ldap','systematic>=3.0.0','python-gnupg'],
    author = 'Ilkka Tuohela',
    author_email = 'hile@iki.fi',
    description = 'Scripts to manage LDAP users and change LDAP passwords',
    long_description = README,
)

