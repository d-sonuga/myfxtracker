from django.conf import settings
from mailchimp_marketing import Client as MainMailChimpApi
from importlib import import_module
from .types import ListMemberInfo
import logging

logger = logging.getLogger(__name__)


class MailChimpApi:
    def __init__(self):
        mailchimp_module_name = getattr(settings, 'MAILCHIMP_API_CLASS_MODULE', 'user.mailchimp.main')
        mailchimp_module = import_module(mailchimp_module_name)
        api_initializer: MainMailChimpApi = getattr(mailchimp_module, 'MainMailChimpApi')
        try:
            self._api: MainMailChimpApi = api_initializer()
            self._api.set_config({
                'api_key': settings.MAILCHIMP_API_KEY,
                'server': settings.MAILCHIMP_SERVER_PREFIX
            })
        except Exception as e:
            logger.exception('Error while initializing MetaApi')
            raise e
    
    def add_member_to_list(self, member_info: ListMemberInfo) -> None:
        self._api.lists.add_list_member(settings.MAILCHIMP_AUDIENCE_ID, member_info)
    
    def delete_list_member(self, email_encoding: str) -> None:
        self._api.lists.delete_list_member(settings.MAILCHIMP_AUDIENCE_ID, email_encoding)

