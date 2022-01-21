from django.test import TestCase, tag
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.authtoken.models import Token
from ..models import Trade, Deposit, Withdrawal, Account


class DeleteUpdateTradeTest(TestCase):

    def setUp(self):
        self.user1_key = 'xmewhfu4yy9r7309849nxgwfe674>{'
        self.user1_details = {'username': '234', 'email': 'sonugadede@gmail.com'}
        self.user1 = User.objects.create(**self.user1_details)
        self.account = Account.objects.create(name='Account 1', user=self.user1)
        Token.objects.create(key=self.user1_key, user=self.user1)
        date = timezone.now().strftime('%Y-%m-%d')
        self.initial_pair = Trade.pair_choices[0][1]
        self.initial_action = Trade.action_choices[1][1]
        self.initial_risk_reward_ratio = 4
        self.initial_profit_loss = 43829.50
        self.initial_pips = 9
        self.trade1 = Trade.objects.create(pair=self.initial_pair, action=self.initial_action, entry_date=date,
                                           exit_date=date, risk_reward_ratio=self.initial_risk_reward_ratio,
                                           profit_loss=self.initial_profit_loss, pips=self.initial_pips,
                                           account=self.account)
        self.headers = {'HTTP_AUTHORIZATION': f'Token {self.user1_key}'}

    @tag('delete_trade')
    def test_delete_trade(self):
        self.client.delete(f'/apis/delete_trade/{self.trade1.id}/', **self.headers)
        self.assertTrue(Trade.objects.all().filter(id=self.trade1.id).count() == 0)

    @tag('update_trade')
    def test_update_trade(self):
        from ..serializers import switch_db_str, Choice
        original_trade = Trade.objects.all()[0]

        new_pair = Trade.pair_choices[20][1]
        new_action = Trade.action_choices[0][1]
        new_risk_reward_ratio = 10
        new_profit_loss = 10000.50
        new_pips = 100

        # For pairs
        self.assertEquals(self.initial_pair, original_trade.pair)
        r = self.client.put(f'/apis/update_trade/{self.trade1.id}/', content_type='application/json',
                            data={'pair': new_pair}, **self.headers)
        print(r.serialize())
        modified_trade = Trade.objects.filter(id=self.trade1.id)[0]
        self.assertEquals(switch_db_str(modified_trade.pair, Choice.PAIRS, Choice.FROM_STR) , new_pair)
        self.assertNotEquals(modified_trade.pair, original_trade.pair)

        # For risk reward ratio
        self.assertEquals(self.initial_risk_reward_ratio, original_trade.risk_reward_ratio)
        self.client.put(f'/apis/update_trade/{self.trade1.id}/', content_type='application/json',
                        data={'risk_reward_ratio': new_risk_reward_ratio}, **self.headers)
        modified_trade = Trade.objects.all()[0]
        self.assertEquals(modified_trade.risk_reward_ratio, new_risk_reward_ratio)
        self.assertNotEquals(modified_trade.risk_reward_ratio, original_trade.pair)

        # For action
        self.assertEquals(self.initial_action, original_trade.action)
        self.client.put(f'/apis/update_trade/{self.trade1.id}/', content_type='application/json',
                        data={'action': new_action}, **self.headers)
        modified_trade = Trade.objects.all()[0]
        self.assertEquals(switch_db_str(modified_trade.action, Choice.ACTIONS, Choice.FROM_STR), new_action)
        self.assertNotEquals(modified_trade.action, original_trade.action)

        # For profit loss
        self.assertEquals(self.initial_profit_loss, original_trade.profit_loss)
        self.client.put(f'/apis/update_trade/{self.trade1.id}/', content_type='application/json',
                        data={'profit_loss': new_profit_loss}, **self.headers)
        modified_trade = Trade.objects.all()[0]
        self.assertEquals(modified_trade.profit_loss, new_profit_loss)
        self.assertNotEquals(modified_trade.profit_loss, original_trade.profit_loss)

        # For pips
        self.assertEquals(self.initial_pips, original_trade.pips)
        self.client.put(f'/apis/update_trade/{self.trade1.id}/', content_type='application/json',
                        data={'pips': new_pips}, **self.headers)
        modified_trade = Trade.objects.all()[0]
        self.assertEquals(modified_trade.pips, new_pips)
        self.assertNotEquals(modified_trade.pips, original_trade.pips)






