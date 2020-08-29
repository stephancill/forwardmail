import os
from django.core.exceptions import ImproperlyConfigured

def get_env_value(env_variable):
    try:
      	return os.environ[env_variable]
    except KeyError:
        error_msg = 'Set the {} environment variable'.format(env_variable)
        raise ImproperlyConfigured(error_msg)

SERVER_ENDPOINT = get_env_value("SERVER_ENDPOINT")
DATABASE_NAME = get_env_value("DATABASE_NAME")
DATABASE_USER = get_env_value("DATABASE_USER")
DATABASE_PASSWORD = get_env_value("DATABASE_PASSWORD")
DATABASE_HOST = get_env_value("DATABASE_HOST")
DATABASE_PORT = int(get_env_value("DATABASE_PORT"))
SECRET_KEY = get_env_value("SECRET_KEY")
PROXY_DOMAIN = get_env_value("PROXY_DOMAIN")
GANDI_API_KEY = get_env_value("GANDI_API_KEY")
DEBUG = get_env_value("DEBUG").lower() == "true"
MAILGUN_API_KEY = get_env_value("MAILGUN_API_KEY")
GOOGLE_OAUTH_CLIENT_ID = get_env_value("GOOGLE_OAUTH_CLIENT_ID")
GOOGLE_OAUTH_SECRET = get_env_value("GOOGLE_OAUTH_SECRET")