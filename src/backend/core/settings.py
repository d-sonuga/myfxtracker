from pathlib import Path
import os
import dj_database_url
from django.utils import timezone

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG') == 'true'

# Is this the archived version of MyFxTracker?
IS_ARCHIVE = os.getenv('IS_ARCHIVE') == 'true'

# App name for deploying with Fly.io
FLY_APP_NAME = os.getenv('FLY_APP_NAME')

ALLOWED_HOSTS = ['*'] if DEBUG else []

if FLY_APP_NAME:
    ALLOWED_HOSTS += [f'{FLY_APP_NAME}.fly.dev']

CSRF_TRUSTED_ORIGINS = []

AUTH_USER_MODEL = 'users.User'

# Application definition

INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.admin',
    'django.contrib.messages',

    'rest_framework',
    'rest_framework.authtoken',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'django_rest_passwordreset',
    'mailchimp_marketing',
    'django_rq',

    'users',
    'trader',
    'affiliate',
    #'admin',
    'serve',
    'paypal_endpoint',
    'paystack_endpoint',
    'flutterwave_endpoint',
    'datasource_endpoint'
]

if DEBUG:
    INSTALLED_APPS += ['corsheaders']

if DEBUG:
    MIDDLEWARE = [
        'corsheaders.middleware.CorsMiddleware',
        #'corsheaders.middleware.CorsPostCsrfMiddleware'
    ]
else:
    MIDDLEWARE = []

MIDDLEWARE += [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR.parent, 'frontend', 'build')
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

ASGI_APPLICATION = 'core.asgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME':  (os.getenv('TEST_DB_NAME') 
            if os.getenv('TEST') == 'true' else os.getenv('DB_NAME')
        ),
        'USER': os.getenv('DB_USER'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'TEST': {
            'NAME': os.getenv('TEST_DB_NAME')
        },
        'OPTIONS': {
            'sslmode': 'disable'
        }
    }
}
if not DEBUG:
    DATABASES['default'] = dj_database_url.config(default=os.getenv('DATABASE_URL'))

SITE_ID = 1


if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True

    CSRF_TRUSTED_ORIGINS = [
        'http://localhost',
        'http://localhost:3000',
        'http://frontend',
        'http://frontend:3000'
    ]

    CORS_ALLOW_CREDENTIALS = True

    CORS_ALLOW_HEADERS = [
        "accept",
        "accept-encoding",
        "authorization",
        "content-type",
        "dnt",
        "origin",
        "user-agent",
        "x-csrftoken",
        "x-requested-with",
        'trader-email'
    ]

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = []


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATIC_URL = 'static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR.parent, 'frontend', 'build'),
    os.path.join(BASE_DIR.parent, 'frontend', 'build', 'static'),
    os.path.join(BASE_DIR, 'trader', 'expert_advisors', 'dist')
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'core.authentication.UserAuthentication',
    ]
}

# For trader registration
REST_AUTH = {
    'REGISTER_SERIALIZER': 'trader.serializers.SignUpSerializer'
}

AUTHENTICATION_BACKENDS = [
    'allauth.account.auth_backends.AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
if DEBUG:
    EMAIL_HOST = '0.0.0.0'
    EMAIL_USE_TLS = False
    EMAIL_PORT = 1025
    EMAIL_HOST_USER = ''
    EMAIL_HOST_PASSWORD = ''
else:
    EMAIL_HOST = os.getenv('EMAIL_HOST')
    EMAIL_USE_TLS = True
    EMAIL_PORT = os.getenv('EMAIL_PORT')
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')

DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_EMAIL_ADDRESS')
SERVER_EMAIL = os.getenv('EMAIL_HOST_USER')
ADMINS = [('MyFxTracker', os.getenv('ADMIN_EMAIL'))]

MAILCHIMP_AUDIENCE_ID = os.getenv('MAILCHIMP_AUDIENCE_ID')
MAILCHIMP_API_KEY = os.getenv('MAILCHIMP_API_KEY')
MAILCHIMP_SERVER_PREFIX = os.getenv('MAILCHIMP_SERVER_PREFIX')
MAILCHIMP_API_CLASS_MODULE = 'users.mailchimp.test_no_error' if DEBUG else 'users.mailchimp.main'
MAILCHIMP_JOURNEY_ID = 6793
MAILCHIMP_STEP_ID = 47389

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_CONFIRM_EMAIL_ON_GET = True

ACCOUNT_EMAIL_VERIFICATION = 'mandatory' if not DEBUG and not IS_ARCHIVE else 'none'

ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_LOGOUT_ON_GET = True

ACCOUNT_PASSWORD_MIN_LENGTH = 8

# The login url is the location the user is redirected to after email confirmation
# A link to this url will be in any confirmation email
if DEBUG:
    if os.getenv('TEST') == 'true':
        LOGIN_URL = 'http://frontend:3000/log-in'
    else:
        LOGIN_URL = 'http://localhost:3000/log-in'
else:
    LOGIN_URL = 'https://myfxtracker.fly.dev/log-in'

# Trader is redirected here if he/she clicks email confirmation link 
# after authentication and logging in
TRADER_APP_URL = 'https://myfxtracker.fly.dev/app'

# Trader is redirected here if he/she clicks email confirmation link 
# after deleting account, meaning he/she has to sign up again
SIGN_UP_URL = 'https://myfxtracker.fly.dev/sign-up'

# Paypal endpoint
PAYPAL_BASE_URL = os.getenv('PAYPAL_BASE_URL') #'https://api-m.sandbox.paypal.com'
PAYPAL_WEBHOOK_ID = os.getenv('PAYPAL_WEBHOOK_ID') #'4MS34996WD956560C'
PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID') #'AbHgh8Xd0m-X-YKOTnOKPgWVdnezshy1jV7rj259MyaCxFMdByxwNZ1EEbWJKaCOqJUA6-aPZ5PQA4ed'
PAYPAL_SECRET = os.getenv('PAYPAL_SECRET') #'ENoMt10xr_0SciPLCmgvpq9x6DArT6B6B7MNt_26uzEI-mfMizFCNgpGRNrJFl9mBxeKzwegLBWvD296'
PAY_USER_KEY = os.getenv('PAY_USER_KEY') #'UXI^-)<Gv\&vhCD|QKl?a.{L>-BGNZdse/HPoX6mAq_eu:f_'
# Paypal endpoint.

# Paystack endpoint
PAYSTACK_SECRET = os.getenv('PAYSTACK_SECRET')
PAYSTACK_PUBLIC_KEY = os.getenv('PAYSTACK_PUBLIC_KEY')
PAYSTACK_BASE_URL = 'https://api.paystack.co'
# Paystack endpoint

MEDIA_ROOT = 'media'
MEDIA_URL = '/media/'

WEEKLY_REPORTS_KEY = os.getenv('WEEKLY_REPORTS_KEY')

# Queues to use for processing of account adding and interactions with the metaapi servers
if DEBUG or IS_ARCHIVE:
    RQ_QUEUES = {
        'default': {
            'URL': 'redis://:@localhost:6379',
        },
        'low': {
            'URL': 'redis://:@localhost:6379',
        }
    }
else:
    RQ_QUEUES = {
        'default': {
            'URL': os.getenv('REDIS_URL'),
            # 10 minutes
            'DEFAULT_TIMEOUT': 60*15
        },
        'low': {
            'URL': os.getenv('REDIS_URL'),
            # 20 minutes
            'DEFAULT_TIMEOUT': 60*20
        }
    }

#RQ_EXCEPTION_HANDLERS = ['trader.views.handle_resolve_add_account_exception']

# The key that is used to authenticate requests to refresh all trader
# account data. The key is used by whatever task manager is making periodic
# requests to refresh traders' account data
REFRESH_ACCOUNTS_REQUEST_KEY = os.getenv('REFRESH_ACCOUNTS_REQUEST_KEY')

# The token that will be used to authenticate the server on MetaApi servers
METAAPI_TOKEN = os.getenv('METAAPI_TOKEN')
# The class that will be used to interact with the MA servers
# It is changed programmatically during tests for testing specific scenarios
# It should not be changed manually
META_API_CLASS_MODULE = 'trader.metaapi.test_no_error' if DEBUG else 'trader.metaapi.main'

FLAPI_CLASS_MODULE = 'flutterwave_endpoint.flwapi.test_no_error' if DEBUG else 'flutterwave_endpoint.flwapi.main'

# To test what happens when an error occurs during user creation
# Always set to false
# It will only be programmatically set to true when the test that uses it
# runs and will be set back to false immediately
TEST_TRADER_CREATE_ERROR = False

# The interval in minutes in which trader data should be refreshed
THIRTY_MINS = 30
TRADER_ACCOUNT_DATA_REFRESH_INTERVAL = int(os.getenv('TRADER_ACCOUNT_DATA_REFRESH_INTERVAL', THIRTY_MINS))

MONTHLY_PLAN_PRICE = 19.95
YEARLY_PLAN_PRICE = 199.95
WBA_PLAN_PRICE = 150.00

PLAN_PRICES = [
    MONTHLY_PLAN_PRICE,
    YEARLY_PLAN_PRICE,
    WBA_PLAN_PRICE
]

# This function is used to get the current time when updating a trader's
# subscriptioninfo. This setting was used to make the subscriptioninfo updates
# testable
TIMEFUNC = timezone.now

# This string is checked against the 'verif-hash' header in Flutterwave
# webhooks for webhook validation
FLUTTERWAVE_VERIF_HASH = os.getenv('FLUTTERWAVE_VERIF_HASH')

# Used by the Flutterwave API for authentication
RAVE_PUBLIC_KEY = os.getenv('RAVE_PUBLIC_KEY')
RAVE_SECRET_KEY = os.getenv('RAVE_SECRET_KEY')

FREE_TRIAL_PERIOD = 7
