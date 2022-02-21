//+------------------------------------------------------------------+
//|                                             MyFxTrackerTests.mq4 |
//|                                      Copyright 2022, MyFxTracker |
//|                                          https://myfxtracker.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2021, MyFxTracker"
#property link      "https://myfxtracker.com"
#property version   "1.00"
#property strict

#include <myfxtracker/tests/testrequester.mqh>


void OnStart(){
   testNoDSUsername();
   testUrlNotAllowed();
   test401InvalidUsername();
   test401ExpiredUsername();
   test403InvalidUsername();
   test403InvalidUsername();
   testConnectionLost();
   MessageBox("Done");
}