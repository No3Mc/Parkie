"""
Simple password generator
"""

import OpenSSL,string

SIMPLE_PASSWORD_LETTERS = string.digits + string.letters
READABLE_PASSWORD_LETTERS = SIMPLE_PASSWORD_LETTERS + '_-./='
COMPLEX_PASSWORD_LETTERS = READABLE_PASSWORD_LETTERS + """!"'#$%&()?:,*<>"""

GENERATE_MODELS = {
    'simple':   SIMPLE_PASSWORD_LETTERS,
    'readable': READABLE_PASSWORD_LETTERS,
    'complex':  COMPLEX_PASSWORD_LETTERS
}

class PasswordGeneratorError(Exception):
    """
    Errors raised by password generator parameters
    """
    def __str__(self):
        return self.args[0]

class PasswordGenerator(object):
    """
    Simple password generator based on pseudorandom data
    """
    def __init__(self,default_length=24):
        try:
            self.default_length = int(default_length)
        except ValueError:
            raise PasswordGeneratorError('Default length must be integer')

    def generate(self,count=1,length=None,model='readable'):
        """
        Generate 'count' number of random passwords with given model,
        passwords of length 'length'
        """
        try:
            count = int(count)
        except ValueError:
            raise PasswordGeneratorError('Count must be integer')
        if length is not None:
            try:
                length = int(length)
            except ValueError:
                raise PasswordGeneratorError('Length must be integer')
        else:
            length = self.default_length
        if model not in GENERATE_MODELS.keys():
            raise PasswordGeneratorError('Unknown model: %s' % model)
        letters = GENERATE_MODELS[model]

        OpenSSL.rand.seed(open('/dev/urandom').read(1024))
        passwords = []
        for i in range(0,count):
            value = ''
            bytes = OpenSSL.rand.bytes(1024)
            for b in bytes:
                # Map the byte to index to our letters
                b = ord(b) % (256-len(letters))
                if b<len(letters):
                    value += letters[b]
                if len(value)>=length:
                    break
            passwords.append(value)
        return passwords


