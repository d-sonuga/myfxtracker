from flutterwave_endpoint.flwapi import PlanStatusError

class Rave:
    def __init__(self, *args, **kwargs) -> None:
        self.Subscriptions = self
    
    def fetch(self, *args, **kwargs):
        raise PlanStatusError(type='unknown', err={'detail': 'unknown'})

    def cancel(self, *args, **kwargs):
        raise PlanStatusError(type='unknown', err={'detail': 'unknown'})
        