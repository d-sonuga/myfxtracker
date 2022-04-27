import logging
import django_rq
from redis import StrictRedis
from django.conf import settings

logger = logging.getLogger(__name__)
default_class_conn = StrictRedis.from_url(settings.RQ_QUEUES['default']['URL'])
low_class_conn = StrictRedis.from_url(settings.RQ_QUEUES['low']['URL'])

def rq_enqueue(*args, queue_class='default', **kwargs):
    if queue_class == 'default':
        logger.info('Enqueueing job on the default queue')
        django_rq.get_queue('default', connection=default_class_conn).enqueue(*args, **kwargs)
    else:
        logger.info('Enqueueing job on the low queue')
        django_rq.get_queue('low', connection=low_class_conn).enqueue(*args, **kwargs)
