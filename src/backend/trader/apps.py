from django.apps import AppConfig

class ApisConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'trader'

    def ready(self):
        import trader.signals
        from trader.signals import schedule_account_data_refresh
        from django.db.backends.signals import connection_created
        connection_created.connect(schedule_account_data_refresh)
        
