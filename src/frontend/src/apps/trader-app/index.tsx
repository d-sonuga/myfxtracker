import {createContext, useEffect, Suspense, lazy, useState, useContext} from 'react'
import {Route, useLocation, useNavigate, Navigate} from 'react-router-dom'
import {TraderAppContainer, TraderAppNavbar} from '@apps/trader-app/components'
import Routes from '@components/router'
import {RouteConst} from '@conf/const'
import {Overview, CashAndGains, Expenses, Settings, LongShortAnalysis, AddAccount,
    PeriodAnalysis, TimeAnalysis, PairsAnalysis, SubscribeNow} from '@apps/trader-app/pages'
import {GlobalData, useGlobalData} from '@apps/trader-app/models'
import {UserData} from '@apps/trader-app/models/types'
import {Http, useNoteData} from '@apps/trader-app/services'
import {PageLoadingErrorBoundary, PageStillLoading} from '@components/generic-pages'
import {ToastContext} from '@components/toast'
import refreshAccountData from './services/refresh-account-data'
import makeFollowUpSubscriptionRequests from './services/follow-up-post-subscription-actions'
import permissionFuncs, { defaultPermissions } from './services/permissions'
import {RawData} from './models/types'
import {AddAccountPropTypes} from './pages/add-account/types'
import {SettingsPropTypes} from './pages/settings/types'
import {NotebookPropTypes} from './pages/notes/types'
import { PermissionsObj } from './services/types'

const Notebook = lazy(() => import('@apps/trader-app/pages/notes'));
const Journal = lazy(() => import('@apps/trader-app/pages/journal'));


const TraderApp = () => {
    const location = useLocation();
    /** User and trade data from the backend. Globally required by most trader app pages */
    const [globalData, setGlobalData, permissions] = useGlobalData();
    /** Is the data currently being refreshed */
    const [dataIsRefreshing, setDataIsRefreshing] = useState(false);
    /** Keep page on loading page indefinitely */
    const [keepPageLoading, setKeepPageLoading] = useState(false);
    const Toast = useContext(ToastContext);
    /** Function called by account selector to change current account */
    const onCurrentAccountChange = (newCurrentAccountId: number) => {
        const newGlobalData = globalData.changeCurrentTradeAccountId(newCurrentAccountId);
        setGlobalData(newGlobalData);
    }
    /** Function called when a new account is added */
    const onAccountAdded = (rawData: RawData) => {
        const newGlobalData = new GlobalData(rawData);
        setGlobalData(newGlobalData);
    }
    /** Function called when an account is removed from settings */
    const removeAccountFromGlobalData = (id: number) => {
        const newGlobalData = globalData.removeAccount(id);
        setGlobalData(newGlobalData);
    }
    /** Function called when refresh account data is called from the data status bar */
    const refreshData = () => refreshAccountData(Toast, setGlobalData, setDataIsRefreshing);
    /** Function called when a user makes a subscription */
    const onNewSubscription = (postActionsPending: boolean, data: {[key: string]: any}, subscriptionPlan: UserData['subscription_plan']) => {
        const newGlobalData = globalData.subscribeUser(subscriptionPlan);
        setGlobalData(newGlobalData);
        /**
         * When postActionsPending are set, a loading icons has to be set
         * and the backend has to be continuously queried for progress.
         * The account data also has to be refreshed, since the setting of the postActionsPending
         * variable means that the account needs to be reconnected for data
         */
        if(postActionsPending){
            Toast.info('Please wait. This might take a while')
            setKeepPageLoading(true);
            // To reconnect the user's account
            makeFollowUpSubscriptionRequests(
                Toast,
                data,
                () => {
                    // Need to refresh data now
                    refreshAccountData(Toast, setGlobalData, setDataIsRefreshing, () => {
                        setKeepPageLoading(false);
                    });
                }
            )
        }
    }
    /** Function called when user successfully cancels subscription */
    const onSubscriptionCancel = () => {
        const {TRADER_APP_ROUTE} = RouteConst;
        const newGlobalData = globalData.unsubscribeUser();
        setGlobalData(newGlobalData);
        navigate(`/${TRADER_APP_ROUTE}`);
    }
    const navigate = useNavigate();
    useEffect(() => {
        Http.initNavigate(navigate);
    }, [])
    const noteData = useNoteData();
    /*
    const permissions: PermissionsObj = (() => {
        console.log('building permissions')
        let permissions: PermissionsObj = {...defaultPermissions};
        permissionFuncs.forEach((permissionFunc: Function) => {
            permissions[permissionFunc.name as keyof(PermissionsObj)] = permissionFunc(globalData);
        })
        console.log('built permissions', permissions);
        return permissions;
    })()
    */
    
    return(
        <>
            <TraderAppNavbar />
            <TraderAppContainer>
                <GlobalDataContext.Provider value={globalData}>
                    <CurrentAccountChangerContext.Provider value={onCurrentAccountChange}>
                        <RefreshDataContext.Provider value={refreshData}>
                        <DataIsRefreshingContext.Provider value={dataIsRefreshing}>
                        <NewSubscriptionContext.Provider value={onNewSubscription}>
                        <SubscriptionCancelContext.Provider value={onSubscriptionCancel}>
                        <PermissionsContext.Provider value={permissions}>
                        {(() => {
                            const pageMap = pageMapConfig(
                                globalData,
                                keepPageLoading,
                                {onAccountAdded: onAccountAdded,
                                    noOfAccounts: globalData.numberOfAccounts(),
                                    userIsOnFreeTrial: globalData.userIsOnFreeTrial(),
                                    userId: globalData.getUserId()
                                },
                                {removeAccountFromGlobalData: removeAccountFromGlobalData},
                                {noteData: noteData}
                            )
                            return(
                                <PageLoadingErrorBoundary>
                                    <Suspense fallback={<PageStillLoading />}>
                                        <Routes>
                                            {Object.keys(pageMap).map((route: string, i: number) => (
                                                <Route path={route} element={pageMap[route]} key={i} />
                                            ))}
                                        </Routes>
                                    </Suspense>
                                </PageLoadingErrorBoundary>
                            )
                        })()}
                        </PermissionsContext.Provider>
                        </SubscriptionCancelContext.Provider>
                        </NewSubscriptionContext.Provider>
                        </DataIsRefreshingContext.Provider>
                        </RefreshDataContext.Provider>
                    </CurrentAccountChangerContext.Provider>
                </GlobalDataContext.Provider>
            </TraderAppContainer>
        </>
    );
}

/** Context to enable all components to have access to globalData */
const GlobalDataContext = createContext(new GlobalData(null));
/**
 * Context for the account selector which is on almost all pages to
 * change accounts.
 * Initialized to empty function to satisfy the Typescript compiler
 * */
const CurrentAccountChangerContext = createContext((newCurrentAccountId: number) => {});
/**
 * Is the data currently being refreshed
 */
const DataIsRefreshingContext = createContext(false);
const RefreshDataContext = createContext(() => {});
const NewSubscriptionContext = createContext((postActionsPending: boolean, data: {[key: string]: any}, subscriptionPlan: UserData['subscription_plan']) => {});
const SubscriptionCancelContext = createContext(() => {});
const PermissionsContext = createContext<PermissionsObj>(defaultPermissions)

/** Returns a mapping of routes to components depending on the state */
const pageMapConfig = (
    globalData: GlobalData,
    keepPageLoading: boolean,
    addAccountComponentConfig: AddAccountPropTypes,
    settingsComponentConfig: SettingsPropTypes,
    notebookProps: NotebookPropTypes
) => {
    const pageStillLoadingComponent = <PageStillLoading />
    if(keepPageLoading){
        return {
            [TRADER_OVERVIEW_ROUTE]: pageStillLoadingComponent,
            [TRADER_JOURNAL_ROUTE]: pageStillLoadingComponent,
            [TRADER_LONG_AND_SHORT_ANALYSIS_ROUTE]: pageStillLoadingComponent,
            [TRADER_CASH_AND_GAINS_ROUTE]: pageStillLoadingComponent,
            [TRADER_SETTINGS_ROUTE]: pageStillLoadingComponent,
            [TRADER_PAIRS_ANALYSIS_ROUTE]: pageStillLoadingComponent,
            [TRADER_ADD_ACCOUNT_ROUTE]: pageStillLoadingComponent,
            [TRADER_TIME_ANALYSIS_ROUTE]: pageStillLoadingComponent,
            [TRADER_PERIOD_ANALYSIS_ROUTE]: pageStillLoadingComponent,
            [TRADER_EXPENSES_ROUTE]: pageStillLoadingComponent,
            [TRADER_NOTES_ROUTE]: pageStillLoadingComponent,
        }
    }
    const addAccountComponent = <AddAccount {...addAccountComponentConfig} />
    const referrerUsername = globalData.getReferrerUsername();
    const subscribeNowComponent = <SubscribeNow 
        email={globalData.getUserEmail()}
        userHasPaidOnce={globalData.userHasPaid()}
        userId={globalData.getUserId()}
        referrerUsername={referrerUsername === undefined ? '' : referrerUsername}
        />
    const subscribeNowRouteComponent = !globalData.userIsOnFreeTrial() && !globalData.userIsSubscribed() ?
        subscribeNowComponent
        : <Navigate to={`/${TRADER_APP_ROUTE}/${TRADER_OVERVIEW_ROUTE}`} />
    if(globalData.hasLoaded()){
        if(globalData.noAccounts()){
            return {
                [TRADER_OVERVIEW_ROUTE]: addAccountComponent,
                [TRADER_JOURNAL_ROUTE]: addAccountComponent,
                [TRADER_LONG_AND_SHORT_ANALYSIS_ROUTE]: addAccountComponent,
                [TRADER_CASH_AND_GAINS_ROUTE]: addAccountComponent,
                [TRADER_SETTINGS_ROUTE]: <Settings {...settingsComponentConfig} />,
                [TRADER_PAIRS_ANALYSIS_ROUTE]: addAccountComponent,
                [TRADER_ADD_ACCOUNT_ROUTE]: addAccountComponent,
                [TRADER_TIME_ANALYSIS_ROUTE]: addAccountComponent,
                [TRADER_PERIOD_ANALYSIS_ROUTE]: addAccountComponent,
                [TRADER_EXPENSES_ROUTE]: addAccountComponent,
                [TRADER_NOTES_ROUTE]: addAccountComponent,
                [TRADER_SUBSCRIBE_NOW_ROUTE]: subscribeNowRouteComponent
            }
        } else {
            return {
                [TRADER_OVERVIEW_ROUTE]: <Overview />,
                [TRADER_JOURNAL_ROUTE]: <Journal />,
                [TRADER_LONG_AND_SHORT_ANALYSIS_ROUTE]: <LongShortAnalysis />,
                [TRADER_CASH_AND_GAINS_ROUTE]: <CashAndGains />,
                [TRADER_SETTINGS_ROUTE]: <Settings {...settingsComponentConfig} />,
                [TRADER_PAIRS_ANALYSIS_ROUTE]: <PairsAnalysis />,
                [TRADER_ADD_ACCOUNT_ROUTE]: addAccountComponent,
                [TRADER_TIME_ANALYSIS_ROUTE]: <TimeAnalysis />,
                [TRADER_PERIOD_ANALYSIS_ROUTE]: <PeriodAnalysis />,
                [TRADER_EXPENSES_ROUTE]: <Expenses />,
                [TRADER_NOTES_ROUTE]: <Notebook {...notebookProps} />,
                [TRADER_SUBSCRIBE_NOW_ROUTE]: subscribeNowRouteComponent
            }
        }
    } else {
        return {
            [TRADER_OVERVIEW_ROUTE]: pageStillLoadingComponent,
            [TRADER_JOURNAL_ROUTE]: pageStillLoadingComponent,
            [TRADER_LONG_AND_SHORT_ANALYSIS_ROUTE]: pageStillLoadingComponent,
            [TRADER_CASH_AND_GAINS_ROUTE]: pageStillLoadingComponent,
            [TRADER_SETTINGS_ROUTE]: pageStillLoadingComponent,
            [TRADER_PAIRS_ANALYSIS_ROUTE]: pageStillLoadingComponent,
            [TRADER_ADD_ACCOUNT_ROUTE]: pageStillLoadingComponent,
            [TRADER_TIME_ANALYSIS_ROUTE]: pageStillLoadingComponent,
            [TRADER_PERIOD_ANALYSIS_ROUTE]: pageStillLoadingComponent,
            [TRADER_EXPENSES_ROUTE]: pageStillLoadingComponent,
            [TRADER_NOTES_ROUTE]: pageStillLoadingComponent,
            [TRADER_SUBSCRIBE_NOW_ROUTE]: pageStillLoadingComponent
        }
    }
}

const {TRADER_OVERVIEW_ROUTE, TRADER_JOURNAL_ROUTE, TRADER_LONG_AND_SHORT_ANALYSIS_ROUTE,
    TRADER_CASH_AND_GAINS_ROUTE, TRADER_SETTINGS_ROUTE, TRADER_PAIRS_ANALYSIS_ROUTE, TRADER_ADD_ACCOUNT_ROUTE,
    TRADER_TIME_ANALYSIS_ROUTE, TRADER_PERIOD_ANALYSIS_ROUTE, TRADER_EXPENSES_ROUTE, TRADER_NOTES_ROUTE,
    TRADER_SUBSCRIBE_NOW_ROUTE, TRADER_APP_ROUTE
} = RouteConst;

export default TraderApp
export {
    GlobalDataContext,
    CurrentAccountChangerContext,
    DataIsRefreshingContext,
    RefreshDataContext,
    NewSubscriptionContext,
    SubscriptionCancelContext,
    PermissionsContext
}