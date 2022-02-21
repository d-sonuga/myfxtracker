//+------------------------------------------------------------------+
//|                                                  MyFxTracker.mq5 |
//|                                  Copyright 2022, MetaQuotes Ltd. |
//|                                          https://myfxtracker.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2022, MetaQuotes Ltd."
#property link      "https://myfxtracker.com"
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

void OnTick(){}