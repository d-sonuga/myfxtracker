#include <JAson.mqh>
#include <myfxtracker/alerter.mqh>
#include <myfxtracker/errorgetter.mqh>
#include <myfxtracker/errors.mqh>
#include <myfxtracker/http.mqh>
#include <myfxtracker/urls.mqh>
#include <myfxtracker/requester.mqh>
#include <myfxtracker/dataassembler.mqh>

/////////////////////////////////////////////////////////////////////
string dealTypeInString(ulong dealType){
    switch(dealType){
        case DEAL_TYPE_BUY:
            return "buy";
        case DEAL_TYPE_SELL:
            return "sell";
        case DEAL_TYPE_BALANCE:
            return "deposit";
        case DEAL_TYPE_CREDIT:
            return "credit";
        case DEAL_TYPE_CHARGE:
            return "charge";
        case DEAL_TYPE_CORRECTION:
            return "correction";
        case DEAL_TYPE_BONUS:
            return "bonus";
        case DEAL_TYPE_COMMISSION:
            return "commission";
        case DEAL_TYPE_COMMISSION_DAILY:
            return "commission daily";
        case DEAL_TYPE_COMMISSION_MONTHLY:
            return "commission monthly";
        case DEAL_TYPE_COMMISSION_AGENT_DAILY:
            return "commission agent daily";
        case DEAL_TYPE_COMMISSION_AGENT_MONTHLY:
            return "commission agent monthly";
        case DEAL_TYPE_INTEREST:
            return "interest";
        case DEAL_TYPE_BUY_CANCELED:
            return "buy cancelled";
        case DEAL_TYPE_SELL_CANCELED:
            return "sell cancelled";
        case DEAL_DIVIDEND:
            return "dividend";
        case DEAL_DIVIDEND_FRANKED:
            return "dividend franked";
        case DEAL_TAX:
            return "tax";
        default:
            return "undetermined for now";
    }
}
void showDealDetails(){
   bool selectionSuccess = HistorySelect(0, TimeCurrent());
   if(selectionSuccess){
       MessageBox("Selection success");
   } else {
       MessageBox("Selection failure");
       MessageBox(GetLastError());
   }
   int totalDeals = HistoryDealsTotal();
   for(int i=0; i<totalDeals; i++){
      ulong dealTicket = HistoryDealGetTicket(i);
      ulong orderNumber;
      datetime dealTime;
      long dealType;
      string dealSymbol;
      string dealComment;
      double dealVolume;
      double dealCommission;
      double dealSwap;
      double dealPrice;
      double dealProfit;
      double dealSl;
      double dealTp;
      ulong dealPosId;
      ulong dealMagicNo;
      //bool success = HistoryDealGetInteger(dealTicket, DEAL_ORDER, orderNumber);
      bool success = HistoryDealGetInteger(dealTicket, DEAL_TIME, dealTime);
      if(success){
          MessageBox("successful time");
      } else {
          MessageBox("failed time");
          MessageBox(GetLastError());
      }
      HistoryDealGetInteger(dealTicket, DEAL_TYPE, dealType);
      HistoryDealGetString(dealTicket, DEAL_SYMBOL, dealSymbol);
      HistoryDealGetString(dealTicket, DEAL_COMMENT, dealComment);
      HistoryDealGetDouble(dealTicket, DEAL_VOLUME, dealVolume);
      HistoryDealGetDouble(dealTicket, DEAL_COMMISSION, dealCommission);
      HistoryDealGetDouble(dealTicket, DEAL_SWAP, dealSwap);
      HistoryDealGetDouble(dealTicket, DEAL_PRICE, dealPrice);
      HistoryDealGetDouble(dealTicket, DEAL_PROFIT, dealProfit);
      HistoryDealGetDouble(dealTicket, DEAL_SL, dealSl);
      HistoryDealGetDouble(dealTicket, DEAL_TP, dealTp);
      HistoryDealGetInteger(dealTicket, DEAL_POSITION_ID, dealPosId);
      HistoryDealGetInteger(dealTicket, DEAL_MAGIC, dealMagicNo);
      string info = "";
      info += "Order number: " + orderNumber + "\n";
      info += "Deal Time: " + dealTime + "\n";
      info += "Deal Type: " + dealTypeInString(dealType) + "\n";
      info += "Deal Symbol: " + dealSymbol + "\n";
      info += "Deal Comment: " + dealComment + "\n";
      info += "Deal Volume: " + dealVolume + "\n";
      info += "Deal Commission: "  + dealCommission + "\n";
      info += "Deal Swap: " + dealSwap + "\n";
      info += "Deal Price: " + dealPrice + "\n";
      info += "Deal Profit: " + dealProfit + "\n";
      info += "Deal Stop Loss: " + dealSl + "\n";
      info += "Deal Take Profit: " + dealTp + "\n";
      info += "Deal Position Id: " + dealPosId + "\n";
      info += "Deal Magic Number: " + dealMagicNo + "\n";
      info += "Deal Ticket Number: " + dealTicket + "\n";
      MessageBox(info, "Deal Details", 0);
   }
}
////////////////////////////////////////////////////////////////

class Executor {
    private:
        BaseRequester *requester;
        BaseAlerter *alerter;
        BaseErrors *errors;
        BaseErrorGetter *errorGetter;
        BaseHttp *http;
        BaseDataAssembler *dataAssembler;
        string DSUsername;
        int noOfSavedTransactions;
        bool currentAccountDataHasBeenSaved;

        Response makeRequest(string url, CJAVal &data){
            return this.requester.sendRequest(
                url,
                this.DSUsername,
                data,
                this.alerter,
                this.errorGetter,
                this.errors,
                this.http
            );
        }
        Response getSavedDataInfo(){
            CJAVal accountInfo = this.dataAssembler.assembleAccountInfo();
            return this.makeRequest(
                GET_INITIAL_INFO_URL,
                accountInfo
            );
        }
        Response saveInitialData(CJAVal &initialData){
            return this.makeRequest(
                SAVE_INITIAL_DATA_URL,
                initialData
            );
        }
        Response saveData(CJAVal &dataToSave){
            return this.makeRequest(
                SAVE_DATA_URL,
                dataToSave
            );
        }
        void launchTimer(){
            EventSetTimer(1);
        }
        void exit(){
            ExpertRemove();
        }
    public:
        Executor(
            string DSUsername,
            BaseRequester *requester,
            BaseAlerter *alerter,
            BaseErrorGetter *errorGetter,
            BaseErrors *errors,
            BaseHttp *http,
            BaseDataAssembler *dataAssembler
        ){
            this.DSUsername = DSUsername;
            this.requester = requester;
            this.alerter = alerter;
            this.errorGetter = errorGetter;
            this.errors = errors;
            this.http = http;
            this.dataAssembler = dataAssembler;
            this.currentAccountDataHasBeenSaved = false;
            this.noOfSavedTransactions = 0;
        }
        void executeInit(){
            Response resp = this.getSavedDataInfo();
            if(resp.respCode == RESP_CODE_SUCCESS){
                CJAVal savedDataInfo = resp.data();
                this.currentAccountDataHasBeenSaved = savedDataInfo["account-data-has-been-saved"].ToBool();
                this.noOfSavedTransactions = savedDataInfo["no-of-transactions"].ToInt();
                if(!currentAccountDataHasBeenSaved){
                    CJAVal initialData = this.dataAssembler.assembleAllDataInJson();
                    Response resp = this.saveInitialData(initialData);
                    if(resp.respCode == RESP_CODE_SUCCESS){
                        CJAVal initDataResp = resp.data();
                        this.currentAccountDataHasBeenSaved = initDataResp["account-data-has-been-saved"].ToBool();
                        this.noOfSavedTransactions = initDataResp["no-of-transactions"].ToInt();
                        this.launchTimer();
                    } else {
                        this.exit();
                    }
                }
            } else {
                this.exit();
            }
        }
        
        void executeTimeout(){
            int noOfActualTransactions = this.dataAssembler.getNoOfActualTransactions();
            if(noOfActualTransactions != this.noOfSavedTransactions){
                int noOfTransactionsNotYetSaved = noOfActualTransactions - noOfSavedTransactions;
                CJAVal dataToSave = this.dataAssembler.getUnsavedTransactionsInJson(
                    noOfActualTransactions,
                    this.noOfSavedTransactions
                );
                Response resp = this.saveData(dataToSave);
                if(resp.respCode == RESP_CODE_SUCCESS){
                    CJAVal savedDataInfo = resp.data();
                    this.noOfSavedTransactions = savedDataInfo["no-of-transactions"].ToInt();
                } else {
                    this.exit();
                }
            }
        }

        void executeDeinit(){
            EventKillTimer();
        }
};