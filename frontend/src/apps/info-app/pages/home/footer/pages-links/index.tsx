import {ColumnBox} from '@components/containers'
import {H6, P} from '@components/text'
import { getDimen } from '@conf/utils'
import Link from './link'


const PagesLinks = () => {
    return(
        <ColumnBox>
            <H6 style={{marginBottom: getDimen('padding-xs')}}>Pages</H6>
            <Link to='/faq'>FAQ</Link>
            <Link to='/pricing'>Features / Pricing</Link>
            <Link to='/sign-up'>Sign Up</Link>
            <Link to='/login'>Login</Link>
        </ColumnBox>
    )
}

export default PagesLinks