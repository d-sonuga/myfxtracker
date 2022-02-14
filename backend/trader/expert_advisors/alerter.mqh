//+------------------------------------------------------------------+
//|                                                      alerter.mqh |
//|                                                      MyFxTracker |
//|                                          https://myfxtracker.com |
//+------------------------------------------------------------------+
#property copyright "MyFxTracker"
#property link      "https://myfxtracker.com"

class BaseAlerter {
   public:
      void showMessage(string message);
};

class Alerter: public BaseAlerter {
   public:
      void showMessage(string message){
         MessageBox(message);
      }
};

class TestAlerter: public BaseAlerter {
   public:
      void showMessage(string message){
      
      }
};