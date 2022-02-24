import {useScreenIsSmall} from '@conf/utils'
import SmallScreenNavbar from './small-screen-navbar'
import BigScreenNavbar from './big-screen-navbar'
import {MainNavbarPropTypes} from './types'
import './style.css'


/**
 * A generic navbar component
 * 
 * @prop links: an array of ['label', 'link'] pairs
 * @prop rightElement: a react element that will be displayed on the right
 *  of the navbar on big screens
 * @prop className: CSS class name
 * @prop style: inline style
 * @prop sidebar: a react node which should be rendered as the sidebar 
 *  instead of the default links sidebar
 * @prop dontShowOnBigScreen: should the navbar show when the screen is big?
 * @prop showLogo: should the logo show on the navbar?
 * 
 */

const Navbar = ({rightElement, sidebar, dontShowOnBigScreen, onSidebarMenuButtonClick,
        sidebarOnlyLinks, ...props}: MainNavbarPropTypes) => {
    const isSmallScreen = useScreenIsSmall();

    if(!isSmallScreen && dontShowOnBigScreen){
        return null;
    }

    return(
        <div className='components-navbar-container'>
            {(() => {
                if(isSmallScreen){
                    return(
                        <SmallScreenNavbar
                            sidebar={sidebar}
                            sidebarOnlyLinks={sidebarOnlyLinks}
                            onSidebarMenuButtonClick={onSidebarMenuButtonClick}
                            {...props} />
                    );  
                } else {
                    return(
                        <BigScreenNavbar
                            rightElement={rightElement}
                            {...props} />
                    );
                }
            })()}
        </div>
    );
}


export default Navbar