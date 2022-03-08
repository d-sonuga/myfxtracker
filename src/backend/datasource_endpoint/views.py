from rest_framework.views import APIView
from rest_framework.response import Response
from datasource_endpoint.models import DatasourceErrors
from trader.models import Account, FailedTransactionSave
from .authentication import DatasourceUsernameAuth
from .permissions import DatasourceUsernameNotExpired, IsAuthenticated


class GetInitialInfo(APIView):
    authentication_classes = [DatasourceUsernameAuth]
    permission_classes = [IsAuthenticated, DatasourceUsernameNotExpired]

    def post(self, request, *args, **kwargs):
        accounts = self.get_associated_accounts(request)
        account_data_has_been_saved = False
        no_of_trades = 0
        no_of_deposits = 0
        no_of_withdrawals = 0
        if accounts:
            account_data_has_been_saved = True
            for account in accounts:
                no_of_trades += account.no_of_trades()
                no_of_deposits += account.no_of_deposits()
                no_of_withdrawals += account.no_of_withdrawals()
        return Response({
            'no-of-transactions': no_of_trades + no_of_deposits + no_of_withdrawals,
            'account-data-has-been-saved': account_data_has_been_saved
        })
    
    def get_associated_accounts(self, request):
        name = request.data.get('account-name')
        broker = request.data.get('account-company')
        login_number = request.data.get('account-login-number')
        account_set = Account.objects.filter(user=request.user).filter(
                name=name,
                broker=broker,
                login_number=login_number
            )
        if account_set.count() != 0:
            return account_set


class SaveInitialData(APIView):
    authentication_classes = [DatasourceUsernameAuth]
    permission_classes = [IsAuthenticated, DatasourceUsernameNotExpired]

    def post(self, request, *args, **kwargs):
        try:
            new_account = Account.objects.create_account(request.user, request.data)
        except Exception:
            FailedTransactionSave.objects.create(user=request.user, data=request.data)
        return Response({
            'no-of-transactions': new_account.no_of_trades()
                + new_account.no_of_deposits()
                + new_account.no_of_withdrawals()
        })


class SaveData(APIView):
    authentication_classes = [DatasourceUsernameAuth]
    permission_classes = [IsAuthenticated, DatasourceUsernameNotExpired]

    def post(self, request, *args, **kwargs):
        try:
            account = Account.objects.get_by_name_broker_login_no(
                request.data['account-name'],
                request.data['account-company'],
                request.data['account-login-number']
            )
            account.save_trades(request.data['account-transactions'])
            account.save_deposits(request.data['account-transactions'])
            account.save_withdrawals(request.data['account-transactions'])
        except Exception:
            FailedTransactionSave.objects.create(user=request.user, data=request.data)
        return Response({
            'no-of-transactions': account.no_of_trades()
                + account.no_of_deposits()
                + account.no_of_withdrawals()
        })


class SaveError(APIView):
    authentication_classes = [DatasourceUsernameAuth]
    permission_classes = [IsAuthenticated, DatasourceUsernameNotExpired]

    def post(self, request, *args, **kwargs):
        DatasourceErrors.objects.create(
            user=request.user,
            **request.data
        )
        return Response()


get_initial_info = GetInitialInfo.as_view()
save_initial_data = SaveInitialData.as_view()
save_data = SaveData.as_view()
save_error = SaveError.as_view()