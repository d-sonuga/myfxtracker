import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route} from 'react-router-dom'
import {MainContainer} from '@components/containers'
import Routes from '@components/router'
import {RouteConst} from '@conf/const'
import InfoApp from '@apps/info-app'
import TraderApp from '@apps/trader-app'
import '@conf/styles/generic.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const {INFO_APP_ROUTE, TRADER_APP_ROUTE} = RouteConst;

ReactDOM.render(
    <React.StrictMode>
        <MainContainer>
            <BrowserRouter>
                <Routes>
                    <Route path={INFO_APP_ROUTE} element={<InfoApp />} />
                    <Route path={TRADER_APP_ROUTE} element={<TraderApp />} />
                </Routes>
            </BrowserRouter>
        </MainContainer>
    </React.StrictMode>,
    document.getElementById('root')
);
