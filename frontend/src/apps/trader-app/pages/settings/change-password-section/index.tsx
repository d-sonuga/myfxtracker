import {ColumnBox} from '@components/containers'
import {H6, P} from '@components/text'
import {RouteConst} from '@conf/const'


const ChangePasswordSection = () => {
    const {INFO_CHANGE_PASSWORD_ROUTE} = RouteConst;
    return(
        <ColumnBox>
            <H6>Your Password</H6>
            <P>Change your password</P>
            <a
                href={`/${INFO_CHANGE_PASSWORD_ROUTE}`}
                target='_blank'
                rel='noreferrer'
                >change password</a>
        </ColumnBox>
    )
}

export default ChangePasswordSection