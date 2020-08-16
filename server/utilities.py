import config
import random
import requests
import string

def random_string(length):
   letters = string.ascii_lowercase
   return ''.join(random.choice(letters) for i in range(length))

def random_address():
    return "{}@{}".format(random_string(25),config.PROXY_DOMAIN)

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

