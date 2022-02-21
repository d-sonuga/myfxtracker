import {ListItemButton} from '@mui/material'
import {List, Collapse} from '@mui/material'
import NavbarText from './navbar-text'
import {SubMenuPropTypes} from './types'


const SubMenu = ({subMenu, subMenuIsOpen, subMenuName, selectedSubMenuName,
        selectedSubMenuItemIndex, onSubMenuItemSelect}: SubMenuPropTypes) => {
    return(
        <Collapse in={subMenuIsOpen && selectedSubMenuName === subMenuName} timeout='auto' unmountOnExit>
            <List disablePadding component='div'>
                {(() => {
                    // Had to explicitly use this function to satisfy the Typescript compiler
                    if(subMenu !== undefined){
                        return subMenu.map((item, i) => (
                            <ListItemButton 
                                key={i}
                                sx={{width: '200px', pl: 8}}
                                selected={i === selectedSubMenuItemIndex}
                                onClick={(e) => {
                                    onSubMenuItemSelect(subMenuName, i, item);
                                }}>
                                <NavbarText>{item.name}</NavbarText>
                            </ListItemButton>
                        ))
                    }
                    return null;
                })()}
            </List>
        </Collapse>
    )
}

export default SubMenu