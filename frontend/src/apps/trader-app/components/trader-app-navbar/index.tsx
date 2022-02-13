import {useContext, useState} from 'react'
import {Drawer, SwipeableDrawer} from '@mui/material'
import {useScreenIsSmall} from '@conf/utils'
import Navbar from '@components/navbar'
import {NAVBAR_WIDTH} from '@apps/trader-app/const'
import Http from '@services/http'
import NavbarList from './navbar-list'
import {HttpConst} from '@conf/const'
import {ToastContext} from '@components/toast'


const TraderAppNavbar = () => {
    const Toast = useContext(ToastContext);
    /** Is the menu open. For small screens */
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const isScreenSmall = useScreenIsSmall();
    const logout = () => {
        const {BASE_URL, LOGOUT_URL} = HttpConst
        Http.delete({
            url: `${BASE_URL}/${LOGOUT_URL}`,
            successFunc: () => {
                localStorage.removeItem('KEY');
            },
            errorFunc: () => {
                Toast.error('Sorry. Something went wrong.');
            }
        })
    }
    
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
                            <NavbarList setMenuIsOpen={setMenuIsOpen} logout={logout} />
                    </SwipeableDrawer>
                }
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
                    <NavbarList setMenuIsOpen={setMenuIsOpen} logout={logout} />
            </Drawer>
        </>
    );
}

export default TraderAppNavbar