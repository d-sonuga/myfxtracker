import {Link} from 'react-router-dom'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import {PlainButton} from '@components/buttons'
import {BP,P,H6} from '@components/text'
import {getDimen} from '@conf/utils'
import {LABEL_INDEX, LINK_INDEX} from './const'
import {SidebarPropTypes} from './types'


const Sidebar = ({links, onCloseSidebar}: SidebarPropTypes) => {
    return(
        <div className='component-navbar-sidebar'>
            <PlainButton 
                onClick={onCloseSidebar}
                style={{float: 'right'}}>
                <CloseRoundedIcon sx={{fontSize: getDimen('large-icon')}}/>
            </PlainButton>
            <div
                style={{marginTop: getDimen('large-icon')}}>
                {
                    <ul>
                        {links.map((linkInfo) => (
                            <li>
                                <Link 
                                    onClick={onCloseSidebar}
                                    to={linkInfo[LINK_INDEX]}
                                    className='components-navbar-link'>
                                    <BP>{linkInfo[LABEL_INDEX]}</BP>
                                </Link>
                            </li>
                        ))}
                    </ul>
                }
            </div>
        </div>
    );
}

export default Sidebar