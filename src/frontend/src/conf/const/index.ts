const FormConst = {
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128
}


/** Urls for contacting the backend */
const HttpConst = {
    BASE_URL: process.env.NODE_ENV !== 'production' ? 
        process.env.REACT_APP_FUNC_TEST === 'true' ? 
            process.env.REACT_APP_FUNC_TEST_BASE_URL
            : process.env.REACT_APP_DEV_BASE_URL
        : process.env.REACT_APP_PROD_BASE_URL,
    SIGN_UP_URL: 'trader/sign-up',
    LOGIN_URL: 'trader/login',
    CHANGE_PASSWORD_URL: 'users/password-change',
    RESET_PASSWORD_URL: 'users/password-reset',
    RESET_PASSWORD_CONFIRM_URL: 'users/password-reset/confirm',
    GET_INIT_DATA_URL: 'trader/get-init-data',
    DOWNLOAD_MT4_EA_URL: 'static/MyFxTracker.ex4',
    DOWNLOAD_MT5_EA_URL: 'static/MyFxTracker.ex5',
    LOGOUT_URL: 'trader/logout',
    SAVE_NOTE_URL: 'trader/save-note',
    UPDATE_NOTE_URL: 'trader/save-note',
    DELETE_NOTE_URL: 'trader/delete-note',
    GET_ALL_NOTES_URL: 'trader/get-all-notes',
    DELETE_ACCOUNT_URL: 'trader/delete-account',
    ADD_TRADING_ACCOUNT_URL: 'trader/add-trading-account',
    REFRESH_DATA_URL: 'trader/refresh-data',
    REMOVE_TRADING_ACCOUNT_URL: 'trader/remove-trading-account',
    FEEDBACK_FORM_URL: 'https://forms.gle/SWAdgLtd64Vzmyso9'
}


/** Routes for client side navigation */
const RouteConst = {
    INFO_APP_ROUTE: '',
    TRADER_APP_ROUTE: `app`,
    /** 
     * All info routes are prefixed by '/'
     * So a trading route of 'faq/' should be read as '/faq/'
     * */
    INFO_HOME_ROUTE: '/',
    INFO_SIGN_UP_ROUTE: 'sign-up/',
    INFO_LOGIN_ROUTE: 'log-in/',
    INFO_FAQ_ROUTE: 'faq/',
    INFO_PRICING_ROUTE: 'pricing/',
    INFO_CHANGE_PASSWORD_ROUTE: 'change-password/',
    INFO_RESET_PASSWORD_ROUTE: 'reset-password',
    /** 
     * All trading routes are prefixed by 'app/'
     * So a trading route of 'journal/' should be read as 'app/journal/'
     * */
    TRADER_OVERVIEW_ROUTE: '',
    TRADER_JOURNAL_ROUTE: 'journal',
    TRADER_CASH_AND_GAINS_ROUTE: 'cash-and-gains',
    TRADER_LONG_AND_SHORT_ANALYSIS_ROUTE: 'long-short-analysis',
    TRADER_PAIRS_ANALYSIS_ROUTE: 'pairs-analysis',
    TRADER_TIME_ANALYSIS_ROUTE: 'time-analysis',
    TRADER_PERIOD_ANALYSIS_ROUTE: 'period-analysis',
    TRADER_EXPENSES_ROUTE: 'expenses',
    TRADER_SETTINGS_ROUTE: 'settings',
    TRADER_NOTES_ROUTE: 'notes',
    TRADER_ADD_ACCOUNT_ROUTE: 'add-account'
}

const ConfigConst = {
    TOKEN_KEY: 'KEY',
    GA_MEASUREMENT_ID: 'G-K2C8098L1V',
    MAX_NO_OF_TRADING_ACCOUNT_FREE_TRIAL_TRADER: 1,
    MAX_NO_OF_TRADING_ACCOUNT_SUBSCRIBED_TRADER: 3
}

export {
    FormConst,
    HttpConst,
    RouteConst,
    ConfigConst
}
