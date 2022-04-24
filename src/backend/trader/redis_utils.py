import django_rq


low_class_conn = django_rq.get_queue('low')
default_class_conn = django_rq.get_queue('default')

def rq_enqueue(*args, **kwargs):
    if kwargs.get('queue_class', 'default') == 'default':
        default_class_conn.enqueue(*args, **kwargs)
    else:
        low_class_conn.enqueue(*args, **kwargs)
