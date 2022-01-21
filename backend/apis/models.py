from django.db import models
from django.contrib.auth.models import User
from PIL import Image


class Account(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.username}\'s account'

class Trade(models.Model):
    pair_choices = (
        ('auus', 'AUDUSD'),
        ('auca', 'AUDCAD'),
        ('aucf', 'AUDCHF'),
        ('aujp', 'AUDJPY'),
        ('aunz', 'AUDNZD'),
        ('ausg', 'AUDSGD'),
        ('cach', 'CADCHF'),
        ('cajp', 'CADJPY'),
        ('chjp', 'CHFJPY'),
        ('chsg', 'CHFSGD'),
        ('euau', 'EURAUD'),
        ('euca', 'EURCAD'),
        ('euch', 'EURCHF'),
        ('eucz', 'EURCZK'),
        ('eugb', 'EURGBP'),
        ('euhu', 'EURHUF'),
        ('eujp', 'EURJPY'),
        ('eumx', 'EURMXN'),
        ('euno', 'EURNOK'),
        ('eunz', 'EURNZD'),
        ('eupl', 'EURPLN'),
        ('euse', 'EURSEK'),
        ('eusg', 'EURSGD'),
        ('eutr', 'EURTRY'),
        ('euus', 'EURUSD'),
        ('euza', 'EURZAR'),
        ('gbau', 'GBPAUD'),
        ('gbca', 'GBPCAD'),
        ('gbch', 'GBPCHF'),
        ('gbjp', 'GBPJPY'),
        ('gbmx', 'GBPMXN'),
        ('gbno', 'GBPNOK'),
        ('gbnz', 'GBPNZD'),
        ('gbse', 'GBPSEK'),
        ('gbsg', 'GBPSGD'),
        ('gbtr', 'GBPTRY'),
        ('gbus', 'GBPUSD'),
        ('nojp', 'NOKJPY'),
        ('nose', 'NOKSEK'),
        ('nzca', 'NZDCAD'),
        ('nzch', 'NZDCHF'),
        ('nzjp', 'NZDJPY'),
        ('nzus', 'NZDUSD'),
        ('sejp', 'SEKJPY'),
        ('sgjp', 'SGDJPY'),
        ('usca', 'USDCAD'),
        ('usch', 'USDCHF'),
        ('uscn', 'USDCNH'),
        ('uscz', 'USDCZK'),
        ('ushu', 'USDHUF'),
        ('usjp', 'USDJPY'),
        ('usmx', 'USDMXN'),
        ('usno', 'USDNOK'),
        ('uspl', 'USDPLN'),
        ('usru', 'USDRUB'),
        ('usse', 'USDSEK'),
        ('ussg', 'USDSGD'),
        ('usth', 'USDTHB'),
        ('usty', 'USDTRY'),
        ('usza', 'USDZAR'),
        ('xaau', 'XAGAUD'),
        ('xaeu', 'XAGEUR'),
        ('xaus', 'XAGUSD'),
        ('xaau', 'XAUAUD'),
        ('xach', 'XAUCHF'),
        ('xaeu', 'XAUEUR'),
        ('xagb', 'XAUGBP'),
        ('xajp', 'XAUJPY'),
        ('xaus', 'XAUUSD'),
        ('xbus', 'XBRUSD'),
        ('xpus', 'XPDUSD'),
        ('xpus', 'XPTUSD'),
        ('xtus', 'XTIUSD'),
        ('zajp', 'ZARJPY')
    )
    action_choices = (
        ('b', 'Buy'),
        ('s', 'Sell')
    )
    pair = models.CharField(max_length=10)
    action = models.CharField(choices=action_choices, max_length=4)
    entry_date = models.DateField()
    exit_date = models.DateField(blank=True, null=True)
    risk_reward_ratio = models.DecimalField(decimal_places=2, max_digits=9)
    profit_loss = models.DecimalField(decimal_places=2, max_digits=11)
    pips = models.DecimalField(decimal_places=2, max_digits=7)
    notes = models.TextField(blank=True, null=True)
    entry_image_link = models.URLField(blank=True, null=True)
    exit_image_link = models.URLField(blank=True, null=True)
    entry_image = models.ImageField(null=True)
    exit_image = models.ImageField(null=True)
    date_added = models.DateField(null=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)

    def save(self, **kwargs) -> None:
        super().save(**kwargs)
        """
        if self.entry_image:
            img = Image.open(self.entry_image.path)
            if img.height > 750:
                if img.width > 750:
                    img.thumbnail((750,750))
                else:
                    img.thumbnail((img.width,750))
            if img.width > 750:
                if img.height > 750:
                    img.thumbnail((750,750))
                else:
                    img.thumbnail((750, img.height))
            img.save(self.entry_image.path)
        if self.exit_image:
            img = Image.open(self.exit_image.path)
            if img.height > 750:
                if img.width > 750:
                    img.thumbnail((750,750))
                else:
                    img.thumbnail((img.width,750))
            if img.width > 750:
                if img.height > 750:
                    img.thumbnail((750,750))
                else:
                    img.thumbnail((750, img.height))
            img.save(self.exit_image.path)
        """


class Deposit(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField(decimal_places=2, max_digits=11)
    date = models.DateField()


class Withdrawal(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField(decimal_places=2, max_digits=11)
    date = models.DateField()


class Preferences(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    current_account = models.ForeignKey(Account, on_delete=models.CASCADE)

class DeleteImages(models.Model):
    url = models.CharField(max_length=100)

""""
class Affiliate(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_affiliate = models.BooleanField(default=False)
"""