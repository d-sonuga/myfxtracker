//+------------------------------------------------------------------+
//|                                                MyFxTrackerEA.mq5 |
//|                                  Copyright 2022, MetaQuotes Ltd. |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2022, MetaQuotes Ltd."
#property link      "https://www.mql5.com"
#property version   "1.00"
#property strict
#include <JAson.mqh>
#include <myfxtracker/alerter.mqh>
#include <myfxtracker/errorgetter.mqh>
#include <myfxtracker/errors.mqh>
#include <myfxtracker/http.mqh>
#include <myfxtracker/requester.mqh>
#include <myfxtracker/dataassembler.mqh>
#include <myfxtracker/executor.mqh>

const string ERR_URL_NOT_ALLOWED_MSG = "Please add https://myfxtracker.com to the list of allowed urls and restart the EA";
const string ERR_INVALID_USERNAME_MSG = "Please input a valid username and restart the EA";
const string ERR_NOT_SUBSCRIBED_MSG = "Please for subscribe for continued service and restart the EA";

input string DSUsername="";

BaseRequester *requester = new Requester();
BaseAlerter *alerter = new Alerter();
BaseErrorGetter *errorGetter = new ErrorGetter();
BaseErrors *errors = new Errors();
BaseHttp *http = new Http();
BaseDataAssembler *dataAssembler = new DataAssembler();

Executor executor(
   DSUsername,
   requester,
   alerter,
   errorGetter,
   errors,
   http,
   dataAssembler
);

int OnInit(){
   executor.executeInit();
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason){
   executor.executeDeinit();
}

void OnTimer(){
   executor.executeTimeout();
}
