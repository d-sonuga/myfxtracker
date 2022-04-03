import {createContext, useEffect, Suspense, lazy, useState, useContext} from 'react'
import {Route, useLocation, useNavigate} from 'react-router-dom'
import {TraderAppContainer, TraderAppNavbar} from '@apps/trader-app/components'
import Routes from '@components/router'
import {RouteConst} from '@conf/const'
import {Overview, CashAndGains, Expenses, Settings, LongShortAnalysis, AddAccount,
    PeriodAnalysis, TimeAnalysis, PairsAnalysis} from '@apps/trader-app/pages'
import {GlobalData, useGlobalData} from '@apps/trader-app/models'
import {Http, useNoteData} from '@apps/trader-app/services'
import {PageLoadingErrorBoundary, PageStillLoading} from '@components/generic-pages'
import {HttpConst} from '@conf/const'
import {HttpErrorType, HttpResponseType} from '@services/http'
import {RawData} from './models/types'
import {ToastContext} from '@components/toast'

const Notebook = lazy(() => import('@apps/trader-app/pages/notes'));
const Journal = lazy(() => import('@apps/trader-app/pages/journal'));


const TraderApp = () => {
    const location = useLocation();
    /** User and trade data from the backend. Globally required by most trader app pages */
    const [globalData, setGlobalData] = useGlobalData();
    /** Is the data currently being refreshed */
    const [dataIsRefreshing, setDataIsRefreshing] = useState(false);
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
    const refreshData = () => {
        const {BASE_URL, REFRESH_DATA_URL} = HttpConst;
        setDataIsRefreshing(true);
        Http.get({
            url: `${BASE_URL}/${REFRESH_DATA_URL}/`,
            successFunc: (resp: HttpResponseType) => {
                const newGlobalData = new GlobalData(resp.data);
                setGlobalData(newGlobalData);
            },
            errorFunc: (err: HttpErrorType) => {
                console.log(err);
                Toast.error('Sorry but something went wrong. Your data could not be refreshed.');
            },
            thenFunc: () => setDataIsRefreshing(false)
        })
    }
    const navigate = useNavigate();
    useEffect(() => {
        Http.initNavigate(navigate);
    }, [])
    const noteData = useNoteData();
    
    const {TRADER_OVERVIEW_ROUTE, TRADER_JOURNAL_ROUTE, TRADER_LONG_AND_SHORT_ANALYSIS_ROUTE,
        TRADER_CASH_AND_GAINS_ROUTE, TRADER_SETTINGS_ROUTE, TRADER_PAIRS_ANALYSIS_ROUTE, TRADER_ADD_ACCOUNT_ROUTE,
        TRADER_TIME_ANALYSIS_ROUTE, TRADER_PERIOD_ANALYSIS_ROUTE, TRADER_EXPENSES_ROUTE, TRADER_NOTES_ROUTE
    } = RouteConst;
    
    return(
        <>
            <TraderAppNavbar />
            <TraderAppContainer>
                <GlobalDataContext.Provider value={globalData}>
                    <CurrentAccountChangerContext.Provider value={onCurrentAccountChange}>
                        <RefreshDataContext.Provider value={refreshData}>
                        <DataIsRefreshingContext.Provider value={dataIsRefreshing}>
                        {(() => {
                            if(globalData.hasLoaded()){
                                if(globalData.noAccounts()){
                                    if(location.pathname.endsWith(TRADER_SETTINGS_ROUTE)){
                                        return <Settings removeAccountFromGlobalData={removeAccountFromGlobalData} />
                                    }
                                    return (
                                        <AddAccount
                                            onAccountAdded={onAccountAdded}
                                            noOfAccounts={globalData.numberOfAccounts()}
                                            userIsOnFreeTrial={globalData.userIsOnFreeTrial()} />
                                    );
                                } else {
                                    return (
                                        <PageLoadingErrorBoundary>
                                            <Suspense fallback={<PageStillLoading />}>
                                                <Routes>
                                                    <Route path={TRADER_OVERVIEW_ROUTE} element={<Overview />} />
                                                    <Route path={TRADER_JOURNAL_ROUTE} element={<Journal />} />
                                                    <Route path={TRADER_LONG_AND_SHORT_ANALYSIS_ROUTE} element={<LongShortAnalysis />} />
                                                    <Route path={TRADER_CASH_AND_GAINS_ROUTE} element={<CashAndGains />} />
                                                    <Route path={TRADER_PAIRS_ANALYSIS_ROUTE} element={<PairsAnalysis />} />
                                                    <Route path={TRADER_TIME_ANALYSIS_ROUTE} element={<TimeAnalysis />} />
                                                    <Route path={TRADER_PERIOD_ANALYSIS_ROUTE} element={<PeriodAnalysis />} />
                                                    <Route path={TRADER_EXPENSES_ROUTE} element={<Expenses />} />
                                                    <Route path={TRADER_NOTES_ROUTE} element={<Notebook noteData={noteData} />} />
                                                    <Route path={TRADER_SETTINGS_ROUTE} element={<Settings removeAccountFromGlobalData={removeAccountFromGlobalData} />} />
                                                    <Route path={TRADER_ADD_ACCOUNT_ROUTE} element={<AddAccount 
                                                        onAccountAdded={onAccountAdded}
                                                        noOfAccounts={globalData.numberOfAccounts()}
                                                        userIsOnFreeTrial={globalData.userIsOnFreeTrial()} />}
                                                        />
                                                </Routes>
                                            </Suspense>
                                        </PageLoadingErrorBoundary>
                                    );
                                }
                            }
                            return <PageStillLoading />
                        })()}
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

export default TraderApp
export {
    GlobalDataContext,
    CurrentAccountChangerContext,
    DataIsRefreshingContext,
    RefreshDataContext
}