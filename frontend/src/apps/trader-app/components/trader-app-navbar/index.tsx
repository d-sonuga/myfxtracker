import {useState} from 'react'
import {Drawer, SwipeableDrawer} from '@mui/material'
import {useScreenIsSmall} from '@conf/utils'
import Navbar from '@components/navbar'
import {NAVBAR_WIDTH} from '@apps/trader-app/const'
import NavbarList from './navbar-list'


const TraderAppNavbar = () => {
    /** Is the menu open. For small screens */
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const isScreenSmall = useScreenIsSmall();
    
    
    return(
        <>
            <Navbar
                dontShowOnBigScreen={true}
                links={[]}
                sidebar={
                    <SwipeableDrawer
                        variant={isScreenSmall ? 'temporary' : 'permanent'}
                        open={menuIsOpen}
                        onClose={() => setMenuIsOpen(false)}
                        onOpen={() => setMenuIsOpen(true)}
                        sx={{width: `${NAVBAR_WIDTH}px`}}>
                            <NavbarList setMenuIsOpen={setMenuIsOpen} />
                    </SwipeableDrawer>}
                showLogo={false}
                onSidebarMenuButtonClick={(e: Event) => setMenuIsOpen(menuIsOpen => !menuIsOpen)}
            />
            <Drawer
                variant={isScreenSmall ? 'temporary' : 'permanent'}
                open={menuIsOpen}
                ModalProps={{
                    keepMounted: true
                }}
                sx={{width: `${NAVBAR_WIDTH}px`}}>
                    <NavbarList setMenuIsOpen={setMenuIsOpen} />
            </Drawer>
        </>
    );
}

export default TraderAppNavbar