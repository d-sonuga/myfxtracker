import MailOutlineIcon from '@mui/icons-material/MailOutline'
import {ColumnBox, RowBox} from '@components/containers'
import {H6, P} from '@components/text'
import Link from '../pages-links/link'
import { getColor } from '@conf/utils'


const Contact = () => {
    return(
        <ColumnBox>
            <H6>Contact</H6>
            <RowBox>
                <MailOutlineIcon />
                <a href='mailto:support@myfxtracker.com'>
                    <P style={{color: getColor('primary-blue')}}>support@myfxtracker.com</P>
                </a>
            </RowBox>
        </ColumnBox>
    )
}

export default Contact