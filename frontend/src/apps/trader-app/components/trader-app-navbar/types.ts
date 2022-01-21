type NavbarItemPropTypes = {
    children: string,
    Icon: Function,
    onClick: Function,
    index: number,
    selected: boolean,
    subMenu?: Array<{name: string, [key: string]: any}>,
    /** For the main menu to know whether or not a sub menu item has been selected */
    onSubMenuItemSelect: Function,
    selectedSubMenuItemIndex: number,
    subMenuIsOpen: boolean,
    selectedSubMenuName: string
}

type SubMenuPropTypes = {
    subMenu: Array<{name: string, [key: string]: any}>,
    /**
     * Is a sub menu open
     */
    subMenuIsOpen: boolean,
    /**
     * The name that appears on the drop down button of the
     * selected sub menu
     */
    selectedSubMenuName: string,
    /**
     * The name that appears on the drop down button for the sub menu
     */
    subMenuName: string,
    /**
     * Array index of the selected item in a sub menu
     */
    selectedSubMenuItemIndex: number,
    /**
     * Function to call when a sub menu item has been selected
     */
    onSubMenuItemSelect: Function
}

type MenuItemObject = {
    icon?: Function,
    name: string,
    route?: string,
    subMenu?: Array<MenuItemObject>,
    action?: Function
}

export type {
    NavbarItemPropTypes,
    MenuItemObject,
    SubMenuPropTypes
}