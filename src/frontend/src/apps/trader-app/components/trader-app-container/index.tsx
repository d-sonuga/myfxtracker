import {ColumnBox} from '@components/containers'
import {getDimen, getDimenInNo, useScreenIsSmall} from '@conf/utils'
import {NAVBAR_WIDTH} from '@apps/trader-app/const'
import {ReactNode} from 'react'

/**
 * A container to wrap all pages in the trader app
 * Gives every page margins to avoid navbar and sidebar
 * overlaps
 */

const TraderAppContainer = ({children}: {children: ReactNode}) => {
    /** 
     * If screen is small, then there will be a navbar.
     * A margin has to be added on top of the container
     * to stay below the navbar.
     */
    const screenIsSmall = useScreenIsSmall();

    return(
        <div 
            style={{
                marginTop: screenIsSmall ? `${getDimenInNo('navbar-height') + 32}px` : 0,
                paddingBottom: getDimen('padding-big'),
                marginLeft: !screenIsSmall ? `${NAVBAR_WIDTH}px` : 0,
                height: 'fit-content',
            }}>
                {children}
        </div>
    )
}

export default TraderAppContainer