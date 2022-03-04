import {ListItem, ListItemButton, ListItemIcon} from '@mui/material'
import {ExpandLess, ExpandMore} from '@mui/icons-material'
import {getColor, getDimen} from '@conf/utils'
import NavbarText from './navbar-text'
import SubMenu from './sub-menu'
import {NavbarItemPropTypes} from './types'


const NavbarItem = ({Icon, children, onClick, index, selected, subMenu, onSubMenuItemSelect,
        subMenuIsOpen, selectedSubMenuItemIndex, selectedSubMenuName}: NavbarItemPropTypes) => {
    const hasSubMenu = () => subMenu !== undefined;
    const hasIcon = () => Icon !== undefined;

    
    return(
        <ListItem disableGutters sx={{
                width: '200px',
                padding: 0,
                marginTop: index === 0 ? getDimen('padding-md') : undefined,
                flexDirection: subMenu ? 'column' : undefined
            }}>
            <ListItemButton sx={{width: '100%'}} selected={selected} onClick={(e) => {
                onClick(e, index);
            }}>
                {hasIcon() ? 
                    <ListItemIcon>
                        <Icon />
                    </ListItemIcon>
                    : null
                }   
                <NavbarText style={{fontSize: '1.1rem'}}>
                    {children}
                </NavbarText>
                {hasSubMenu() ? 
                    subMenuIsOpen ? 
                        <ExpandLess sx={{color: getColor('dark-gray')}} />
                        : <ExpandMore sx={{color: getColor('dark-gray')}} />
                    : null
                }
            </ListItemButton>
            {subMenu !== undefined ?
                <SubMenu
                    subMenu={subMenu}
                    subMenuIsOpen={subMenuIsOpen}
                    subMenuName={children}
                    selectedSubMenuName={selectedSubMenuName}
                    selectedSubMenuItemIndex={selectedSubMenuItemIndex}
                    onSubMenuItemSelect={onSubMenuItemSelect} />
                : null
            }
        </ListItem>
    );
}

export default NavbarItem