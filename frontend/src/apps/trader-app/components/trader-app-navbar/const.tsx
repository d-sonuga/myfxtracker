import HouseIcon from '@visuals/svgs/house-icon'
import CalendarIcon from '@visuals/svgs/calendar-icon'
import NotesIcon from '@visuals/svgs/notes-icon'
import GalleryIcon from '@visuals/svgs/gallery-icon'
import AnalyticsChartIcon from '@visuals/svgs/analytics-chart-icon'
import SettingsIcon from '@visuals/svgs/settings-icon'
import LogOutIcon from '@visuals/svgs/log-out-icon'
import {RouteConst} from '@conf/const'
import {MenuItemObject} from './types'


const {TRADER_OVERVIEW_ROUTE, TRADER_JOURNAL_ROUTE, TRADER_LONG_AND_SHORT_ANALYSIS_ROUTE,
    TRADER_CASH_AND_GAINS_ROUTE, TRADER_SETTINGS_ROUTE, TRADER_PAIRS_ANALYSIS_ROUTE,
    TRADER_TIME_ANALYSIS_ROUTE, TRADER_PERIOD_ANALYSIS_ROUTE, TRADER_EXPENSES_ROUTE,
    TRADER_NOTES_ROUTE
} = RouteConst;

const analyticsMenuItems: MenuItemObject[] = [
    {name: 'Cash and Gains', route: TRADER_CASH_AND_GAINS_ROUTE},
    {name: 'Long / Short Analysis', route: TRADER_LONG_AND_SHORT_ANALYSIS_ROUTE},
    {name: 'Pairs Analysis', route: TRADER_PAIRS_ANALYSIS_ROUTE},
    {name: 'Trading Time Analysis', route: TRADER_TIME_ANALYSIS_ROUTE},
    {name: 'Period Analysis', route: TRADER_PERIOD_ANALYSIS_ROUTE},
    {name: 'Expenses', route: TRADER_EXPENSES_ROUTE},
];

const mainMenuItems: MenuItemObject[] = [
    {icon: HouseIcon, name: 'Overview', route: TRADER_OVERVIEW_ROUTE},
    {icon: CalendarIcon, name: 'Journal', route: TRADER_JOURNAL_ROUTE},
    {icon: AnalyticsChartIcon, name: 'Analytics', subMenu: analyticsMenuItems},
    {icon: GalleryIcon, name: 'Gallery'},
    {icon: NotesIcon, name: 'Notes', route: TRADER_NOTES_ROUTE}
];

const bottomMenuItems: MenuItemObject[] =  [
    {icon: SettingsIcon, name: 'Settings', route: TRADER_SETTINGS_ROUTE},
    {icon: LogOutIcon, name: 'Log Out', action: () => {}},
];

const menuItems = {
    mainMenuItems,
    bottomMenuItems
}
export default menuItems