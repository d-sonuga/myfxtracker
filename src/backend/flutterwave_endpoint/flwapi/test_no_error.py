class Rave:
    def __init__(self, *args, **kwargs):
        self.Subscriptions = self
    
    def fetch(self, *args, **kwargs):
        return {
            'error': False,
            'returnedData': {
                'status': 'success', 'message': 'SUBSCRIPTIONS-FETCHED',
                'data': {'page_info': {'total': 1, 'current_page': 1, 'total_pages': 1},
                    'plansubscriptions': [
                        {'id': 17111, 'amount': 25, 'next_due': '2022-07-11T06:19:28.000Z',
                        'customer': {'id': 1653948, 'customer_email': 'user@gmail.com'},
                        'plan': 20974, 'status': 'active', 'date_created': '2022-06-11T06:19:28.000Z'}
                    ]
                }
            }
        }

    def cancel(self, *args, **kwargs):
        return {
            'error': False,
            'returnedData': {
                'status': 'success', 'message': 'SUBSCRIPTION-CANCELLED',
                'data': {'id': 17110, 'amount': 25, 'next_due': '2022-07-11T06:03:52.000Z',
                'customer': {'id': 1653941, 'customer_email': 'user@gmail.com'},
                'plan': 20974, 'status': 'cancelled', 'date_created': '2022-06-11T06:03:52.000Z'}}
        }
    

                