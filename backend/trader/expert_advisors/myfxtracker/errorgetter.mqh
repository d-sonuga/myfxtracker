//+------------------------------------------------------------------+
//|                                                  errorgetter.mqh |
//|                                                      MyFxTracker |
//|                                          https://myfxtracker.com |
//+------------------------------------------------------------------+
#property copyright "MyFxTracker"
#property link      "https://myfxtracker.com"

interface BaseErrorGetter {
   public:
      int getError();
};

class ErrorGetter: public BaseErrorGetter {
   public:
      int getError(){
         return GetLastError();
      }
};

class TestErrorGetter: public BaseErrorGetter {
   private:
      int errorCode;
   public:
      TestErrorGetter(int errorCode){
         this.errorCode = errorCode;
      }
      int getError(){
         return this.errorCode;
      }
};