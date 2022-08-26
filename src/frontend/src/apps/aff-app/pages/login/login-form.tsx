import ReactGA from 'react-ga4'
import {Yup} from '@apps/info-app/components'
import {Button} from '@components/buttons'
import {HttpErrorType, HttpResponseType} from '@services/http'
import {ConfigConst, RouteConst} from '@conf/const'
import {TextInput} from '@apps/info-app/components'
import {LoginFormPropTypes} from './types'
import LoadingIcon from '@components/loading-icon'
import {HttpMsg} from '@services/generic-msg'
import {Form} from '@apps/info-app/components'
import {canSubmit, buildErrors} from '@components/forms'
import { AffiliateData } from '@apps/aff-app/use-affiliate-data'
import { FormikProps } from 'formik'
import { useContext } from 'react'
import { ToastContext } from '@components/toast'


const LoginForm = ({submitValues, storageService, navigate, setAffiliateData}: LoginFormPropTypes & {setAffiliateData: (data: AffiliateData) => void}) => {
    const Toast = useContext(ToastContext);
    return(
        <Form
            title='Log In'
            initialValues={{
                username: '',
                password: ''
            }}
            validationSchema={Yup.object({
                username: Yup.string().required(),
                password: Yup.string().required()
            })}
            onSubmit={({values, setErrors, setSubmitting, setSuccessMsg, setNonFieldError}) => {
                submitValues({
                    values,
                    successFunc: (resp: HttpResponseType) => {
                        storageService.setItem(ConfigConst.TOKEN_KEY, resp.data.key);
                        AffiliateData.refreshData(setAffiliateData, Toast);
                        navigate(`/${RouteConst.AFF_APP_ROUTE}/${RouteConst.AFF_OVERVIEW_ROUTE}`);
                        setNonFieldError('');
                    },
                    errorFunc: (err: HttpErrorType) => {
                        try {
                            const errors: {[key: string]: string} = buildErrors(err.response.data, {
                                'username': 'username', 'password': 'password'
                            });
                            setErrors(errors);
                            setNonFieldError(errors['non_field_errors'])
                        } catch(err){
                            setNonFieldError(HttpMsg.unexpectedErr())
                        }
                        setSuccessMsg('');
                    },
                    thenFunc: () => setSubmitting(false)
                })
            }}>
                {({values, errors, isSubmitting, submitForm}: FormikProps<any>) => (
                    <>
                    <TextInput name='username' placeholder='Username' data-testid='username' />
                    <TextInput name='password' placeholder='Password' type='password' data-testid='password' />
                        <Button
                            onClick={canSubmit(errors, values) ? () => submitForm() : () => {}}
                            data-testid='submit-button'
                            disabled={!canSubmit(errors, values)}>
                            {isSubmitting ? <LoadingIcon /> : 'Log In'}</Button>
                    </>
                )}
        </Form>
    )
}


export default LoginForm