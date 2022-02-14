#include <JAson.mqh>
#include <myfxtracker/alerter.mqh>
#include <myfxtracker/errorgetter.mqh>
#include <myfxtracker/errors.mqh>
#include <myfxtracker/http.mqh>
#include <myfxtracker/urls.mqh>
#include <myfxtracker/dataassembler.mqh>


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
                this.noOfSavedTransactions = savedDataInfo["no-of-saved-transactions"].ToInt();
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