import logging
from redis import StrictRedis
from django.conf import settings


if __name__ == '__main__':
    logger = logging.getLogger()
    logger.info('Clearing redis db and scheduling')
    with StrictRedis.from_url(settings.RQ_QUEUES['default']['URL']) as conn:
        conn.flushall()
        conn.close()