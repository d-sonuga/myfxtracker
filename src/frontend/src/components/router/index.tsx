/**
 * A router component to add 404 pages to react routers
 */

import {ReactNode} from 'react'
import {Routes as ReactRoutes, Route} from 'react-router'
import {Page404} from '@components/generic-pages'


const Routes = ({children}: {children: ReactNode}) => {
    return(
        <ReactRoutes>
            {children}
            <Route path='*' element={<Page404 />} />
        </ReactRoutes>
    );
}

export default Routes