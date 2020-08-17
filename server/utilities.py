import config
import random
import requests
import forwardmail.settings as settings
import string
from functools import wraps

def debug_return(value):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if settings.DEBUG:
                return value
            else:
                return f(*args, **kwargs)
        return wrapper
    return decorator

def random_string(length):
   letters = string.ascii_lowercase
   return ''.join(random.choice(letters) for i in range(length))

def random_address():
    return "{}@{}".format(random_string(25),config.PROXY_DOMAIN)

@debug_return(True)
def create_remote_alias(alias_address, forward_address):
    if "@" in alias_address:
        alias_address = alias_address.split("@")[0]
    r = requests.post("https://api.gandi.net/v5/email/forwards/forwardmail.rocks", json={
        "source": alias_address,
        "destinations": [forward_address]
    }, headers={
        "Authorization": "Apikey {}".format(config.GANDI_API_KEY)
    })

    print(r.status_code, r.json())

    return  200 <= r.status_code < 300

@debug_return(True)
def remove_remote_alias(alias_address):
    if "@" in alias_address:
        alias_address = alias_address.split("@")[0]
    
    r = requests.delete("https://api.gandi.net/v5/email/forwards/forwardmail.rocks/{}".format(alias_address), headers={
        "Authorization": "Apikey {}".format(config.GANDI_API_KEY)
    })

    print(r.status_code, r.json())

    return  200 <= r.status_code < 300

