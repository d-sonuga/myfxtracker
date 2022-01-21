import {useState} from 'react'
import {useLocation, useNavigate, Location} from 'react-router'
import {Drawer, List, Divider, SwipeableDrawer, Collapse} from '@mui/material'
import Logo from '@components/logo'
import {getDimen, useScreenIsSmall} from '@conf/utils'
import HouseIcon from '@visuals/svgs/house-icon'
import CalendarIcon from '@visuals/svgs/calendar-icon'
import NotesIcon from '@visuals/svgs/notes-icon'
import GalleryIcon from '@visuals/svgs/gallery-icon'
import AnalyticsChartIcon from '@visuals/svgs/analytics-chart-icon'
import NavbarItem from './navbar-item'
import SettingsIcon from '@visuals/svgs/settings-icon'
import LogOutIcon from '@visuals/svgs/log-out-icon'
import Navbar from '@components/navbar'
import {RouteConst} from '@conf/const'
import {NAVBAR_WIDTH} from '@apps/trader-app/const'
import menuItems from './const'
import getIntialNavbarListStateValues from './utils'
import {MenuItemObject} from './types'


const NavbarList = ({setMenuIsOpen}: {setMenuIsOpen: Function}) => {
    const location = useLocation();

    const {mainMenuItems, bottomMenuItems} = menuItems;
    const {initialMainMenuItemIndex, initialSubMenuItemSelected, initialSubMenuName,
        initialSelectedSubMenuItemIndex, initialSubMenuIsOpen
    } = getIntialNavbarListStateValues(location, menuItems);
    /** Menu index of currently selected menu item */
    const [selectedMainMenuItemIndex, setSelectedMainMenuItemIndex] = useState(initialMainMenuItemIndex);
    /** Has a sub menu item being selected */
    const [subMenuItemSelected, setSubMenuItemSelected] = useState(initialSubMenuItemSelected);
    /** The array index of the sub menu item that has 
     * been selected in the array of its menu items */
    const [selectedSubMenuItemIndex, setSelectedSubMenuItemIndex] = useState(initialSelectedSubMenuItemIndex);
    /** The name that appears on the button of the drop down menu that has the sub menu */
    const [selectedSubMenuName, setSelectedSubMenuName] = useState(initialSubMenuName);
    /** Is a sub menu currently open */
    const [subMenuIsOpen, setSubMenuIsOpen] = useState(initialSubMenuIsOpen);

    const navigate = useNavigate();
    const doesntHaveSubMenu = (item: {[key: string]: any}) => item.subMenu === undefined;
    const unselectSubMenu = () => {
        setSelectedSubMenuItemIndex(-1);
        setSelectedSubMenuName('');
    }
    const unselectMainMenuItem = () => setSelectedMainMenuItemIndex(-1);
    const selectSubMenuItem = (name: string, index: number) => {
        setSubMenuItemSelected(true);
        setSelectedSubMenuItemIndex(index);
        setSelectedSubMenuName(name);
    }
    const closeSubMenu = () => {
        setSubMenuIsOpen(false);
        //setSelectedSubMenuItemIndex(-1);
        //setSelectedSubMenuName('');
    }
    const closeMenu = () => setMenuIsOpen(false);
    const carryOutItemAction = (item: {[key: string]: any}) => {
        if(item.route !== undefined){
            navigate(item.route);
        } else {
            item.action();
        }
    }
    const itemInSubMenuIsSelected = (item: {[key: string]: any}) => 
        selectedMainMenuItemIndex === -1 && selectedSubMenuName === item.name;
    const openSubMenu = (item: {[key: string]: any}) => {
        setSubMenuIsOpen(true);
        setSelectedSubMenuName(item.name);
    }
    const itemInASubMenuHasBeenSelected = () => selectedSubMenuItemIndex !== -1;

    const onMainMenuItemClick = (e: Event, itemJustSelectedIndex: number, item: {[key: string]: any}) => {
        // If item has sub menu, then it's a dropdown,
        // not a link to a page
        if(doesntHaveSubMenu(item)){
            // Close any open sub menu first if any are open
            if(subMenuItemSelected){
                // Unselect the sub menus
                unselectSubMenu();
            }
            // Sub menu might be open, even if none of its items have been selected
            closeSubMenu();
            setSelectedMainMenuItemIndex(itemJustSelectedIndex);
            /** For small screens, close the menu on clicking an item */
            closeMenu();
            carryOutItemAction(item);
        } else {
            if(subMenuIsOpen){
                closeSubMenu();
                if(itemInSubMenuIsSelected(item)){
                    setSelectedMainMenuItemIndex(itemJustSelectedIndex);
                }
            } else {
                openSubMenu(item);
                if(itemInASubMenuHasBeenSelected() && selectedSubMenuName === item.name){
                    unselectMainMenuItem();
                }
            }
        }
    }
    const onSubMenuItemSelect = (name: string, index: number, item: {[key: string]: any}) => {
        // Unselect main menu items when sub menu item is selected
        unselectMainMenuItem();
        selectSubMenuItem(name, index);
        carryOutItemAction(item);
        /** For small screens */
        closeMenu();
    }

    return(
            <>
                <List sx={{alignItems: 'center', padding: getDimen('padding-md')}}>
                    <Logo style={{marginBottom: getDimen('padding-xbig')}} />
                    {mainMenuItems.map((item, i) => (
                        createNavbarItem(item, i, selectedMainMenuItemIndex, onMainMenuItemClick,
                            onSubMenuItemSelect, selectedSubMenuItemIndex, subMenuIsOpen, selectedSubMenuName)
                    ))}
                </List>
                <Divider sx={{mx: getDimen('padding-md')}}/>
                <List sx={{alignItems: 'center', padding: getDimen('padding-md')}}>
                    {bottomMenuItems.map((item, i) => (
                        createNavbarItem(item, i + mainMenuItems.length, selectedMainMenuItemIndex,
                            onMainMenuItemClick, onSubMenuItemSelect, selectedSubMenuItemIndex,
                            subMenuIsOpen, selectedSubMenuName)
                    ))}
                </List>
            </>
    )
}

const createNavbarItem = (item: {[key: string]: any}, i: number, selectedMainMenuItemIndex: number,
        onMainMenuItemClick: Function, onSubMenuItemSelect: Function, selectedSubMenuItemIndex:number,
        subMenuIsOpen: boolean, selectedSubMenuName: string) => {
    return(
        <NavbarItem
            key={i}
            Icon={item.icon}
            index={i}
            onClick={(e: Event, i: number) => onMainMenuItemClick(e, i, item)}
            selected={selectedMainMenuItemIndex === i}
            subMenu={item.subMenu ? item.subMenu : undefined}
            onSubMenuItemSelect={onSubMenuItemSelect}
            selectedSubMenuItemIndex={selectedSubMenuItemIndex}
            subMenuIsOpen={subMenuIsOpen}
            selectedSubMenuName={selectedSubMenuName}>
                {item.name}
        </NavbarItem>
    );
}



export default NavbarList