
class BaseErrors {
    public:
        int URL_NOT_ALLOWED_CODE;
        string URL_NOT_ALLOWED_MSG;
        int SERVER_CONNECTION_LOST_CODE;
        string SERVER_CONNECTION_LOST_MSG;
        int NO_DATASOURCE_USERNAME_CODE;
        string NO_DATASOURCE_USERNAME_MSG;
        int INVALID_USERNAME_CODE;
        string INVALID_USERNAME_MSG;
        int SUBSCRIPTION_EXPIRED_CODE;
        string SUBSCRIPTION_EXPIRED_MSG;
        string UNKNOWN_ERR_MSG;
        BaseErrors(){
            this.SERVER_CONNECTION_LOST_CODE = 5203;
            this.SERVER_CONNECTION_LOST_MSG = "The server connection is lost";
            this.NO_DATASOURCE_USERNAME_CODE = -2;
            this.NO_DATASOURCE_USERNAME_MSG = "Please restart the EA with your MT username";
            this.INVALID_USERNAME_CODE = -3;
            this.INVALID_USERNAME_MSG = "Please restart the EA with a valid username";
            this.SUBSCRIPTION_EXPIRED_CODE = -4;
            this.SUBSCRIPTION_EXPIRED_MSG = "Your subscription has expired. You need to pay for continued usage.";
            this.UNKNOWN_ERR_MSG = "Unknown Error";
            this.URL_NOT_ALLOWED_MSG = "The url isnt in the allowed urls list";
        }
        string getErrorMessage(int errorCode){
            if(errorCode == this.URL_NOT_ALLOWED_CODE){
                return this.URL_NOT_ALLOWED_MSG;
            } else if(errorCode == this.SERVER_CONNECTION_LOST_CODE){
                return this.SERVER_CONNECTION_LOST_MSG;
            }
            return this.UNKNOWN_ERR_MSG;
        }
};

#ifdef __MQL4__

class Errors: public BaseErrors {
    public:
        Errors(){
            this.URL_NOT_ALLOWED_CODE = 4060;
        }
};

#else

class Errors: public BaseErrors {
    public:
        Errors(){
            this.URL_NOT_ALLOWED_CODE = 4014;
        }
};

#endif

const string MQ5_WEB_REQUEST_SERVER_CONNECTION_LOST_ERROR = 1001;

