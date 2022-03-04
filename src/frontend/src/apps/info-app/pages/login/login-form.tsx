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
import {canSubmit, buildErrors} from '@apps/info-app/form-utils'


const LoginForm = ({submitValues, storageService, navigate}: LoginFormPropTypes) => {
    return(
        <Form
            title='Log In'
            initialValues={{
                email: '',
                password: ''
            }}
            validationSchema={Yup.object({
                email: Yup.string().email().required(),
                password: Yup.string().required()
            })}
            onSubmit={({values, setErrors, setSubmitting, setSuccessMsg, setNonFieldError}) => {
                submitValues({
                    values,
                    successFunc: (resp: HttpResponseType) => {
                        storageService.setItem(ConfigConst.TOKEN_KEY, resp.data.key);
                        navigate(`/${RouteConst.TRADER_APP_ROUTE}`);
                        setNonFieldError('');
                        ReactGA.event('log_in', {
                            method: 'site login up form'
                        })
                    },
                    errorFunc: (err: HttpErrorType) => {
                        try {
                            const errors: {[key: string]: string} = buildErrors(err.response.data, {
                                'email': 'email', 'password': 'password'
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
                {({values, errors, isSubmitting, submitForm}) => (
                    <>
                    <TextInput name='email' placeholder='Email' type='email' data-testid='email' />
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