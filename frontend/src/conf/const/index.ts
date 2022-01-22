const FormConst = {
    PASSWORD_MIN_LENGTH: 8
}


/** Urls for contacting the backend */
const HttpConst = {
    BASE_URL: 'http://localhost:8000',
    SIGN_UP_URL: 'users/sign-up',
    LOGIN_URL: 'users/login',
    GET_INIT_DATA_URL: 'apis/init_data',
    FEEDBACK_FORM_URL: 'https://forms.gle/SWAdgLtd64Vzmyso9'
}


/** Routes for client side navigation */
const RouteConst = {
    INFO_APP_ROUTE: '/*',
    TRADER_APP_ROUTE: `app/*`,
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
    /** 
     * All trading routes are prefixed by 'app/'
     * So a trading route of 'journal/' should be read as 'app/journal/'
     * */
    TRADER_OVERVIEW_ROUTE: '',
    TRADER_JOURNAL_ROUTE: 'journal',
    TRADER_CASH_AND_GAINS_ROUTE: 'cash-and-gains',
    TRADER_LONG_AND_SHORT_ANALYSIS_ROUTE: 'long-short-analysis',
    TRADER_PAIRS_ANALYSIS_ROUTE: 'pairs-analysis',
    TRADER_TIME_ANALYSIS_ROUTE: 'trader-time-analysis',
    TRADER_PERIOD_ANALYSIS_ROUTE: 'period-analysis',
    TRADER_EXPENSES_ROUTE: 'expenses',
    TRADER_SETTINGS_ROUTE: 'settings',
    TRADER_NOTES_ROUTE: 'notes'
}

const ConfigConst = {
    TOKEN_KEY: 'KEY'
}

export {
    FormConst,
    HttpConst,
    RouteConst,
    ConfigConst
}
