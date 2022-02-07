/**
 * A class to represent the global data from the backend
 * 
 * Format of global data from backend:
 * The index of the trades, withdrawals and deposits arrays in data corresponds to the index of the account
 * it is associated with in the accounts array
 * user_data: {
 *   id: id of current user,
 *   email: email-of-current-user,
 *   is_subscribed: subscription-status-of-current-user,
 *   on_free: true or false, whether or not user is still using free version,
 *   logins_after_ask: number of times user logged in after last feedback popup question,
 *   current_feedback_question: index of the current feedback question
 * },
 * trade_data: {
 *        'no_of_trades': total number of trades the user has added
 *        'current_account_id': id-of-currently-selected-account,
 *        'accounts': {
 *            'Account id': {
 *                    'name': 'Name of the account',
 *                    'trades': [trades],
 *                    'deposits': [deposits],
 *                    'withdrawals': [withdrawals]
 *            },
 *            ...
 *        }
 *    }
*/

import {RawData} from './types'
import {cloneObject} from './utils'

class GlobalData {
    rawData: RawData;
    constructor(rawData: RawData | null){
        if(rawData === null){
            this.rawData = initialEmptyRawData;
        } else {
            this.rawData = rawData
        }
        this.hasLoaded = this.hasLoaded.bind(this);
        this.getCurrentTradeAccountData = this.getCurrentTradeAccountData.bind(this);
        this.getCurrentTradeAccountId = this.getCurrentTradeAccountId.bind(this);
        this.getCurrentTradeAccountName = this.getCurrentTradeAccountName.bind(this);
        this.getTradeAccountNames = this.getTradeAccountNames.bind(this);
        this.changeCurrentTradeAccountId = this.changeCurrentTradeAccountId.bind(this);
        this.getTradeAccountIdOf = this.getTradeAccountIdOf.bind(this);
        this.getUserEmail = this.getUserEmail.bind(this);
        this.userIsSubscribed = this.userIsSubscribed.bind(this);
        this.userIsOnFreeTrial = this.userIsOnFreeTrial.bind(this);
    }
    /** Has the data from the backend loaded */
    hasLoaded(){
        /** A real user id is always a positive number an never negative */
        return this.rawData.user_data.id !== -1
    }
    /** What is the id of the currently selected trading account */
    getCurrentTradeAccountId(){
        return this.rawData.trade_data.current_account_id;
    }
    /** What is the account name of the currently selected trading account */
    getCurrentTradeAccountName(){
        if(this.hasLoaded()){
            const x = this.getCurrentTradeAccountId();
            return this.rawData.trade_data.accounts[x].name;
        } else {
            return 'None';
        }
    }
    /** What are the names of all the trading accounts */
    getTradeAccountNames(){
        const accountIds = Object.keys(this.rawData.trade_data.accounts);
        if(accountIds.length === 0){
            /** Just so the account selector will have something to show */
            return ['None'];
        }
        let accountNames: string[] = [];
        accountIds.forEach((accountId: string) => {
            accountNames.push(this.rawData.trade_data.accounts[parseInt(accountId)].name);
        });
        return accountNames
    }
    /** Change the currently selected trading account id to @param newCurrentAccountId */
    changeCurrentTradeAccountId(newCurrentAccountId: number){
        const rawDataClone = cloneObject(this.rawData);
        rawDataClone.trade_data.current_account_id = newCurrentAccountId;
        return new GlobalData(rawDataClone);
    }
    /** Returns an object of all data related to the currently selected account */
    getCurrentTradeAccountData(){
        const currentAccountId = this.getCurrentTradeAccountId();
        return this.rawData.trade_data.accounts[currentAccountId];
    }
    /** Given the account name @param accountName, return the associated id */
    getTradeAccountIdOf(accountName: string){
        const accountIds = Object.keys(this.rawData.trade_data.accounts);
        for(const accountId of accountIds){
            const account = this.rawData.trade_data.accounts[parseInt(accountId)];
            if(account.name === accountName){
                return parseInt(accountId);
            }
        }
        /** The fact that this function is called means the id can never be -1
         * But this line is here just to satisfy the typescript compiler
         */
        return -1;
    }
    /** Are there any accounts? */
    noAccounts(){
        return Object.keys(this.rawData.trade_data.accounts).length === 0
    }
    getUserEmail(){
        return this.rawData.user_data.email
    }
    userIsSubscribed(){
        return this.rawData.user_data.is_subscribed
    }
    userIsOnFreeTrial(){
        return this.rawData.user_data.on_free
    }
}

const initialEmptyRawData = {
    user_data: {
        id: -1,
        email: '',
        is_subscribed: false,
        on_free: false,
        logins_after_ask: -1,
        current_feedback_question: -1
    },
    trade_data: {
        no_of_trades: -1,
        current_account_id: -1,
        accounts: {}
    }
};

export default GlobalData