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

import {AccountData} from 'calculator/dist'
import {RawData, UserData} from './types'
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
        this.numberOfAccounts = this.numberOfAccounts.bind(this);
        this.getUserId = this.getUserId.bind(this);
        this.getAllAccounts = this.getAllAccounts.bind(this);
        this.getTradeAccountIdOf = this.getTradeAccountIdOf.bind(this);
        this.removeAccount = this.removeAccount.bind(this);
        this.lastDataRefreshTime = this.lastDataRefreshTime.bind(this);
        this.subscribeUser = this.subscribeUser.bind(this);
    }
    /** Has the data from the backend loaded */
    hasLoaded(): boolean {
        /** A real user id is always a positive number an never negative */
        return this.rawData.user_data.id !== -1
    }
    /** What is the id of the currently selected trading account */
    getCurrentTradeAccountId(): number {
        let accountId = this.rawData.trade_data.current_account_id;
        if(accountId === -1){
            return parseInt(Object.keys(this.rawData.trade_data.accounts)[0]);
        }
        return accountId;
    }
    /** What is the account name of the currently selected trading account */
    getCurrentTradeAccountName(): string {
        if(this.hasLoaded()){
            let accountId = this.getCurrentTradeAccountId();
            return this.rawData.trade_data.accounts[accountId].name;
        } else {
            return 'None';
        }
    }
    /** What are the names of all the trading accounts */
    getTradeAccountNames(): string[] {
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
    changeCurrentTradeAccountId(newCurrentAccountId: number): GlobalData{
        const rawDataClone = cloneObject(this.rawData);
        rawDataClone.trade_data.current_account_id = newCurrentAccountId;
        return new GlobalData(rawDataClone);
    }
    /** Returns an object of all data related to the currently selected account */
    getCurrentTradeAccountData(): AccountData{
        const currentAccountId = this.getCurrentTradeAccountId();
        return this.rawData.trade_data.accounts[currentAccountId];
    }
    /** Given the account name @param accountName, return the associated id */
    getTradeAccountIdOf(accountName: string): number {
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
    /** Get number of accounts */
    numberOfAccounts(): number {
        return Object.keys(this.rawData.trade_data.accounts).length
    }
    /** Get all accounts as an array of objects */
    getAllAccounts(): (AccountData & {id: number})[] {
        const accountIds = Object.keys(this.rawData.trade_data.accounts);
        return accountIds.map((accountId: any) => ({
            id: accountId as number, ...this.rawData.trade_data.accounts[accountId as number]
        }));
    }
    /** 
     * Remove account with an id of @param id 
     * and return a new updated GlobalData object
     * */
    removeAccount(id: number): GlobalData {
        const newAccounts = Object.keys(this.rawData.trade_data.accounts)
            .filter((accountId) => accountId != id.toString())
            .map((accountId) => ({
                ...this.rawData.trade_data.accounts[parseInt(accountId)]
            }));
        const newRawData: RawData = cloneObject(this.rawData);
        newRawData.trade_data.accounts = newAccounts;
        if(newRawData.trade_data.current_account_id === id){
            newRawData.trade_data.current_account_id = -1;
        }
        const newGlobalData = new GlobalData(newRawData);
        return newGlobalData;
    }
    /** Set the user's is subscribed field to true */
    subscribeUser(): GlobalData {
        const rawDataClone: RawData = cloneObject(this.rawData);
        rawDataClone.user_data.is_subscribed = true;
        rawDataClone.user_data.has_paid = true;
        return new GlobalData(rawDataClone);
    }
    /** Are there any accounts? */
    noAccounts(): boolean {
        return this.numberOfAccounts() === 0;
    }
    lastDataRefreshTime(): Date {
        return new Date(this.rawData.trade_data.last_data_refresh_time);
    }
    getUserId(): number {
        return this.rawData.user_data.id
    }
    getUserEmail(): string {
        return this.rawData.user_data.email
    }
    getUserDsUsername(): string {
        return this.rawData.user_data.ds_username;
    }
    getUserSubscriptionPlan(): UserData['subscription_plan'] {
        return this.rawData.user_data.subscription_plan
    }
    getDaysLeftBeforeFreeTrialExpires(): number {
        return this.rawData.user_data.days_left_before_free_trial_expires
    }
    userIsSubscribed(): boolean {
        return this.rawData.user_data.is_subscribed
    }
    userIsOnFreeTrial(): boolean {
        return this.rawData.user_data.on_free
    }
    userHasPaid(): boolean {
        const hasPaid = this.rawData.user_data.has_paid;
        return hasPaid !== undefined && hasPaid
    }
}

const initialEmptyRawData: RawData = {
    user_data: {
        id: -1,
        email: '',
        ds_username: '',
        is_subscribed: false,
        on_free: false,
        logins_after_ask: -1,
        current_feedback_question: -1,
        subscription_plan: 'none',
        days_left_before_free_trial_expires: 7
    },
    trade_data: {
        current_account_id: -1,
        last_data_refresh_time: new Date(1900, 0, 1),
        accounts: {}
    }
};

export default GlobalData