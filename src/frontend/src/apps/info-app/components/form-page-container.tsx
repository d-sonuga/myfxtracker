import {Link} from 'react-router-dom'
import {CenterColumnBox, RowBox} from '@components/containers'
import Logo from '@components/logo'
import {SP, P} from '@components/text'
import {getColor, getDimen} from '@conf/utils'
import {ConfigConst} from '@conf/const'
import { ReactNode } from 'react'
import ArchiveBanner from '@components/archive'

/**
 * Container for the form component in the info app
 */

const FormPageContainer = ({form, bottomText}: {form: ReactNode, bottomText?: ReactNode}) => {
    return(
        <>
            {ConfigConst.IS_ARCHIVE ?
                <ArchiveBanner />
                : null
            }
            <CenterColumnBox className='apps-info-app-components-form-page-container'>
                <Logo style={{marginBottom: getDimen('padding-md')}} />
                {form}
                {bottomText}
            </CenterColumnBox>
        </>
    )
}

export default FormPageContainer