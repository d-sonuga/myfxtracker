from django.test import TestCase, tag
from django.contrib.auth.models import User
from django.utils import timezone
import rest_framework
from rest_framework.authtoken.models import Token
from ..models import Trade, Deposit, Withdrawal, Account


class TradeSavingTest(TestCase):

    def setUp(self):
        self.user_details = {'email': 'sonugademilade8703@gmail.com'}
        self.user = User.objects.create(**self.user_details)
        self.user.set_password('password')
        self.user.save()
        self.user.userinfo.is_trader = True
        self.user.userinfo.save()
        self.account = Account.objects.create(name='Account 1', user=self.user)
        self.headers = {
            'HTTP_AUTHORIZATION': f'Token {Token.objects.create(key=",xfjq483rxupq89983qh4", user=self.user)}'
        }

    @tag('test_trade_saving')
    def test_trade_saving(self):
        """To test the trade saving functionality"""
        # Iterate through all the possible pair and trade combinations, create trades with them and save them all
        time = timezone.now().strftime('%Y-%m-%d')
        trade_list = []
        responses = []
        for pair in Trade.pair_choices:
            for action in Trade.action_choices:
                trade_details = {'pair': 'DREDJFN', 'action': action[1], 'entry_date': time,
                                 'exit_date': time, 'risk_reward_ratio': 3, 'profit_loss': 333378,
                                 'pips': 3, 'notes': 'the lesson', 'account': self.account.id,
                                 'entry_image_link': 'https://r.com', 'exit_image_link': 'https://r.com'}
                # Append all the trades to a list so they can be checked against it,
                # to see whether they were saved as they were supposed to be
                trade_list.append(trade_details)
                responses.append(self.client.post('/apis/add_trade/', data=trade_details, **self.headers))
        
        for response in responses:
            print(response.serialize())
            self.assertEquals(response.status_code, 201)

        # Check every single trade that was saved against the list that was created while saving them,
        # to see if they were saved as they were supposed to be
        from ..serializers import switch_db_str, Choice
        for x in range(0, Trade.objects.all().count()):
            trade = Trade.objects.filter(id=x + 1)[0]
            self.assertEqual(trade.pips, trade_list[x]['pips'])
            self.assertEqual(trade.entry_date.strftime('%Y-%m-%d'), trade_list[x]['entry_date'])
            self.assertEqual(trade.exit_date.strftime('%Y-%m-%d'), trade_list[x]['exit_date'])
            self.assertEqual(trade.notes, trade_list[x]['notes'])
            self.assertEqual(trade.account.id, trade_list[x]['account'])
            self.assertEqual(trade.risk_reward_ratio, trade_list[x]['risk_reward_ratio'])
            self.assertEqual(trade.pair, switch_db_str(trade_list[x]['pair'], Choice.PAIRS, Choice.TO_STR))
            self.assertEqual(trade.action, switch_db_str(trade_list[x]['action'], Choice.ACTIONS, Choice.TO_STR))
            self.assertEqual(trade.entry_image_link, trade_list[x]['entry_image_link'])
            self.assertEqual(trade.exit_image_link, trade_list[x]['exit_image_link'])

