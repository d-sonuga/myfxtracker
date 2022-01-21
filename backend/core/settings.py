from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'idcc2=#3@bp2$yasc2e23@tra!^)z=##wb4ml*1$2y!bfiouek'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*'] if DEBUG else [
    'myfxtracker.com'
]


# Application definition

INSTALLED_APPS = [
    #'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    'rest_framework',
    'rest_framework.authtoken',
    'allauth',
    'allauth.account',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'corsheaders',
    'django_rest_passwordreset',
    'mailchimp_marketing',

    'apis',
    'users',
    'serve',
    # New for paypal
    'paypal_endpoint',
    # New for paypal.
    'paystack_endpoint',
    # New for affiliate
    'affiliate',
    # New for affiliate.
    'admin'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'corsheaders.middleware.CorsPostCsrfMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'static'),
            os.path.join(BASE_DIR.parent, 'frontend', 'calculator', 'docs') if DEBUG else []
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

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
        'PASSWORD': os.getenv('DB_PASSWORD')
    }
}

SITE_ID = 1

if DEBUG:
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://localhost:3001'
    ]

    CSRF_TRUSTED_ORIGINS = [
        'http://localhost:3000',
        'http://localhost:3001'
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

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    # os.path.join(BASE_DIR, 'static', 'static'),
    os.path.join(BASE_DIR, 'static')
]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication'
    ]
}

REST_AUTH_REGISTER_SERIALIZERS = {
    'REGISTER_SERIALIZER': 'users.serializers.SignUpSerializer'
}

AUTHENTICATION_BACKENDS = [
    'allauth.account.auth_backends.AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend'
]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')

MAILCHIMP_AUDIENCE_ID = os.getenv('MAILCHIMP_AUDIENCE_ID')
MAILCHIMP_API_KEY = os.getenv('MAILCHIMP_API_KEY')
MAILCHIMP_SERVER_PREFIX = os.getenv('MAILCHIMP_SERVER_PREFIX')

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_CONFIRM_EMAIL_ON_GET = True

ACCOUNT_EMAIL_VERIFICATION = 'none' if DEBUG else 'mandatory'

ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_LOGOUT_ON_GET = True

ACCOUNT_PASSWORD_MIN_LENGTH = 8

# Paypal endpoint
PAYPAL_BASE_URL = os.getenv('PAYPAL_BASE_URL') #'https://api-m.sandbox.paypal.com'
PAYPAL_WEBHOOK_ID = os.getenv('PAYPAL_WEBHOOK_ID') #'4MS34996WD956560C'
PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID') #'AbHgh8Xd0m-X-YKOTnOKPgWVdnezshy1jV7rj259MyaCxFMdByxwNZ1EEbWJKaCOqJUA6-aPZ5PQA4ed'
PAYPAL_SECRET = os.getenv('PAYPAL_SECRET') #'ENoMt10xr_0SciPLCmgvpq9x6DArT6B6B7MNt_26uzEI-mfMizFCNgpGRNrJFl9mBxeKzwegLBWvD296'
PAY_USER_KEY = os.getenv('PAY_USER_KEY') #'UXI^-)<Gv\&vhCD|QKl?a.{L>-BGNZdse/HPoX6mAq_eu:f_'
# Paypal endpoint.

# Paystack endpoint
PAYSTACK_SECRET = 'sk_test_88cb3aa853218e67b746e53dd64450fd25de57c2'
PAYSTACK_PUBLIC_KEY = 'pk_test_6c33b872ddac420b2fb9196f66e7cf5fc788c231'
PAYSTACK_BASE_URL = 'https://api.paystack.co'
# Paystack endpoint

SUBSCRIPTION_COST = 20

MEDIA_ROOT = 'media'
MEDIA_URL = '/media/'

WEEKLY_REPORTS_KEY = os.getenv('WEEKLY_REPORTS_KEY')
#DATA_UPLOAD_MAX_MEMORY_SIZE = 10000000000000000000000000000000