/**
 * To determine the initial state for the navbar on page load
 */

import {useLocation, useNavigate, Location} from 'react-router'
import {MenuItemObject} from './types'


const getPageRouteName = (location: Location) => {
    const locationList = location.pathname.split('/app');
    let route = stripSlashes(locationList[locationList.length - 1]);
    return route;
}

const getIntialNavbarListStateValues = (location: Location, menuItems: {[key: string]: MenuItemObject[]}) => {
    const pageRoute = getPageRouteName(location);
    let [initialSubMenuName, initialMainMenuItemIndex] = getMenuInfo(pageRoute, menuItems);
    let initialSubMenuIsOpen = false;
    let initialSubMenuItemSelected = false;
    let initialSelectedSubMenuItemIndex = -1;
    if(initialSubMenuName.length !== 0){
        initialSubMenuIsOpen = true;
        initialSelectedSubMenuItemIndex = initialMainMenuItemIndex;
        initialMainMenuItemIndex = -1;
    }
    return {
        initialSubMenuName, initialMainMenuItemIndex, initialSubMenuItemSelected,
        initialSelectedSubMenuItemIndex, initialSubMenuIsOpen
    }
}

/**
 * Find the index of the menu item associated with a @param: route
 * and its subMenuName, if it belongs to a subMenu
 * */
const getMenuInfo = (route: string, menuItems: {[key: string]: MenuItemObject[]}): [string, number] => {
    for(const itemsKey of Object.keys(menuItems)){
        for(let i=0; i<menuItems[itemsKey].length; i++){
            const item = menuItems[itemsKey][i];
            if(item.subMenu !== undefined){
                let [subMenuName, menuItemIndex] = getMenuInfo(route, {'submenu': item.subMenu});
                subMenuName = item.name;
                if(menuItemIndex !== -1){
                    menuItemIndex = adjustIndexForBottomMenuItems(menuItemIndex, itemsKey, menuItems);
                    return [subMenuName, menuItemIndex];
                }
            } else {
                if(item.route === route){
                    i = adjustIndexForBottomMenuItems(i, itemsKey, menuItems);
                    return ['', i];
                }
            }
        }
    }
    return ['', -1];
}

const adjustIndexForBottomMenuItems = (menuItemIndex: number, itemsKey: string,
        menuItems: {[key: string]: MenuItemObject[]}) => {
    // Adjust the index for bottomMenuItems,
    // so its indexes dont clash with the topMenuItems's
    if(itemsKey === 'bottomMenuItems'){
        menuItemIndex += menuItems['mainMenuItems'].length
    }
    return menuItemIndex;
}

const stripSlashes = (route: string) => {
    if(route.startsWith('/')){
        route = route.substr(1);
    }
    if(route.endsWith('/')){
        route = route.substr(0, route.length - 1);
    }
    return route;
}

export default getIntialNavbarListStateValues