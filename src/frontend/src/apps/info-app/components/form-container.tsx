import {ReactNode} from 'react'
import {CenterColumnBox} from '@components/containers'

/**
 * A component to be used as the page containers for the
 * info app login and sign up forms
 */

const FormPageContainer = ({children}: {children: ReactNode}) => {
    return(
        <CenterColumnBox className='apps-info-app-components-form-container'>
            {children}
        </CenterColumnBox>
    )
}

export default FormPageContainer