import {createContext, useEffect, Suspense, lazy} from 'react'
import {Route, useLocation, useNavigate} from 'react-router-dom'
import {TraderAppContainer, TraderAppNavbar} from '@apps/trader-app/components'
import Routes from '@components/router'
import {RouteConst} from '@conf/const'
import {Overview, CashAndGains, Expenses, Settings, LongShortAnalysis,
    PeriodAnalysis, TimeAnalysis, PairsAnalysis} from '@apps/trader-app/pages'
import {GlobalData, useGlobalData} from '@apps/trader-app/models'
import {Http, getNoteData} from '@apps/trader-app/services'
import {PageLoadingErrorBoundary, PageStillLoading} from '@components/generic-pages'
import DataSourceSetupInstructions from './data-source-setup-instructions'
import useEaDownloadUrl from './services/ea-download-url'

const Notebook = lazy(() => import('@apps/trader-app/pages/notes'));
const Journal = lazy(() => import('@apps/trader-app/pages/journal'));


const TraderApp = () => {
    const location = useLocation();
    /** User and trade data from the backend. Globally required by most trader app pages */
    const [globalData, setGlobalData] = useGlobalData();
    /** Function called by account selector to change current account */
    const onCurrentAccountChange = (newCurrentAccountId: number) => {
        const newGlobalData = globalData.changeCurrentTradeAccountId(newCurrentAccountId);
        setGlobalData(newGlobalData);
    }
    const navigate = useNavigate();
    useEffect(() => {
        Http.initNavigate(navigate);
    }, [])
    const eaDownloadUrls = useEaDownloadUrl();
    const noteData = getNoteData();

    const {TRADER_OVERVIEW_ROUTE, TRADER_JOURNAL_ROUTE, TRADER_LONG_AND_SHORT_ANALYSIS_ROUTE,
        TRADER_CASH_AND_GAINS_ROUTE, TRADER_SETTINGS_ROUTE, TRADER_PAIRS_ANALYSIS_ROUTE,
        TRADER_TIME_ANALYSIS_ROUTE, TRADER_PERIOD_ANALYSIS_ROUTE, TRADER_EXPENSES_ROUTE, TRADER_NOTES_ROUTE
    } = RouteConst;
    
    return(
        <>
            <TraderAppNavbar />
            <TraderAppContainer>
                <GlobalDataContext.Provider value={globalData}>
                    <CurrentAccountChangerContext.Provider value={onCurrentAccountChange}>
                        {(() => {
                            if(globalData.hasLoaded()){
                                if(globalData.noAccounts()){
                                    if(location.pathname.endsWith(TRADER_SETTINGS_ROUTE)){
                                        return <Settings />
                                    }
                                    return <DataSourceSetupInstructions
                                                dsUsername={globalData.getUserDsUsername()}
                                                eaDownloadUrls={eaDownloadUrls}
                                                />
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
                                                    <Route path={TRADER_SETTINGS_ROUTE} element={<Settings />} />
                                                </Routes>
                                            </Suspense>
                                        </PageLoadingErrorBoundary>
                                    );
                                }
                            }
                            return <PageStillLoading />
                        })()}
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

export default TraderApp
export {GlobalDataContext, CurrentAccountChangerContext}