import {ComponentPropTypes} from '@components/types'
import {ReactNode, MouseEventHandler} from 'react'


type NavbarPropTypes = ComponentPropTypes & {
    /** The links to be rendered on the navbar */
    links: Array<Array<string>>,
    /** Should the logo show on the navbar? */
    showLogo?: boolean,
    sidebarOnlyLinks?: NavbarPropTypes['links']
}

type SmallScreenNavbarPropTypes = NavbarPropTypes & {
    /** 
     * React component to be passed if component wants to 
     * override navbar's default sidebar links
     * */
    sidebar?: ReactNode,
    /** 
     * Function to be called if a component wants to override 
     * the default behaviour of the sidebar menu button
     * */
    onSidebarMenuButtonClick?: Function
}

type BigScreenNavbarPropTypes = NavbarPropTypes & {
    /** React component to be rendered on the right side of the navbar */
    rightElement?: ReactNode
}

type MainNavbarPropTypes = SmallScreenNavbarPropTypes & BigScreenNavbarPropTypes & {
    /** Should the navbar show on the big screen?
     * (The sidebar will still show)
     */
    dontShowOnBigScreen?: boolean
}

type SidebarPropTypes = Pick<NavbarPropTypes, 'sidebarOnlyLinks'> & {
    /** links to be rendered on the sidebar */
    links: Array<Array<string>>,
    /** The function used for the default sidebar to close the sidebar */
    onCloseSidebar: MouseEventHandler
}

export type {
    SmallScreenNavbarPropTypes,
    BigScreenNavbarPropTypes,
    SidebarPropTypes,
    MainNavbarPropTypes
}
