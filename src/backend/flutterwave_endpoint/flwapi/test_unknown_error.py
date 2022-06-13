class Rave:
    def __init__(self, *args, **kwargs) -> None:
        self.Subscriptions = self
    
    def fetch(self, *args, **kwargs):
        raise Exception

    def cancel(self, *args, **kwargs):
        raise Exception
        