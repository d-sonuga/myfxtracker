import logging
import django_rq

logger = logging.getLogger()
low_class_conn = django_rq.get_queue('low')
default_class_conn = django_rq.get_queue('default')

def rq_enqueue(*args, **kwargs):
    if kwargs.get('queue_class', 'default') == 'default':
        logger.info('Enqueueing job on the default queue')
        default_class_conn.enqueue(*args, **kwargs)
    else:
        logger.info('Enqueueing job on the low queue')
        low_class_conn.enqueue(*args, **kwargs)
