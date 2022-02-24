import {useState} from 'react'
import {SwipeableDrawer} from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import {RowBox} from '@components/containers'
import {PlainButton} from '@components/buttons'
import Logo from '@components/logo'
import Sidebar from './sidebar'
import {SmallScreenNavbarPropTypes} from './types'
import {getDimen} from '@conf/utils'


const SmallScreenNavbar = ({links, className, style, sidebar, showLogo, sidebarOnlyLinks,
        onSidebarMenuButtonClick}: SmallScreenNavbarPropTypes) => {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const toggleSidebar = () => {
        setSidebarIsOpen(sidebarIsOpen => !sidebarIsOpen);
    }

    return(
        <RowBox
            className={className}
            style={style}>
            <PlainButton 
                style={{
                    marginRight: getDimen('padding-xs'),
                    marginLeft: getDimen('padding-md')
                }}
                onClick={(e) => onSidebarMenuButtonClick ? onSidebarMenuButtonClick(e) : toggleSidebar()}>
                    <MenuRoundedIcon sx={{
                        fontSize: getDimen('large-icon')
                    }}/>
            </PlainButton>
            {
                sidebar ? sidebar
                    : <SwipeableDrawer
                        anchor='left'
                        variant='temporary'
                        open={sidebarIsOpen}
                        onOpen={() => {}}
                        onClose={toggleSidebar}>
                            <Sidebar
                                links={(() => {
                                    if(sidebarOnlyLinks !== undefined){
                                        return [...links, ...sidebarOnlyLinks];
                                    }
                                    return links;     
                                })()}
                                onCloseSidebar={toggleSidebar} />
                        </SwipeableDrawer>
            }
            {showLogo === undefined || showLogo ? <Logo /> : null}
        </RowBox>
    )
}

export default SmallScreenNavbar