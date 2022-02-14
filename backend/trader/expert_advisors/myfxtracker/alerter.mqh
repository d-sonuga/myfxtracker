//+------------------------------------------------------------------+
//|                                                      alerter.mqh |
//|                                                      MyFxTracker |
//|                                          https://myfxtracker.com |
//+------------------------------------------------------------------+
#property copyright "MyFxTracker"
#property link      "https://myfxtracker.com"

interface BaseAlerter {
   public:
      void showMessage(string message);
      string getMessage();
};

class Alerter: public BaseAlerter {
   public:
      void showMessage(string message){
         MessageBox(message);
      }
      string getMessage(){
         return "";
      }
};

class TestAlerter: public BaseAlerter {
   public:
      string message;
      TestAlerter(){
         this.message = "no message here";
      }
      void showMessage(string message){
         this.message = message;
      }
      string getMessage(){
         return this.message;
      }
};