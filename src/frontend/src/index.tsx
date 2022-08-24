import React, {lazy, Suspense} from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route} from 'react-router-dom'
import {MainContainer} from '@components/containers'
import Routes from '@components/router'
import {RouteConst} from '@conf/const'
import InfoApp from '@apps/info-app'
import {PageStillLoading, PageLoadingErrorBoundary} from '@components/generic-pages'
import '@conf/styles/generic.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const TraderApp = lazy(() => import('@apps/trader-app'));
const AffApp = lazy(() => import('@apps/aff-app'));

const {INFO_APP_ROUTE, TRADER_APP_ROUTE, AFF_APP_ROUTE} = RouteConst;

ReactDOM.render(
    <React.StrictMode>
        <MainContainer>
            <PageLoadingErrorBoundary>
                <Suspense fallback={<PageStillLoading />}>
                    <BrowserRouter>
                        <Routes>
                            <Route path={`${INFO_APP_ROUTE}/*`} element={<InfoApp />} />
                            <Route path={`${TRADER_APP_ROUTE}/*`} element={<TraderApp />} />
                            <Route path={`${AFF_APP_ROUTE}/*`} element={<AffApp />} />
                        </Routes>
                    </BrowserRouter>
                </Suspense>
            </PageLoadingErrorBoundary>
        </MainContainer>
    </React.StrictMode>,
    document.getElementById('root')
);
