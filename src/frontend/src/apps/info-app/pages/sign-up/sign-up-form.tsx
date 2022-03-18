import ReactGA from 'react-ga4'
import {Yup} from '@apps/info-app/components'
import {Button} from '@components/buttons'
import {getColor} from '@conf/utils'
import {FormConst} from '@conf/const'
import {FormMsg, HttpMsg} from '@services/generic-msg'
import {SelectInput, TextInput} from '@apps/info-app/components'
import LoadingIcon from '@components/loading-icon'
import {HttpResponseType} from '@services/http'
import {Form} from '@apps/info-app/components'
import {buildErrors, canSubmit} from '@components/forms'


/**
 * The form for signing up new users
 * The @param submitValues function is the function passed into the form
 * for submitting form data
 * There are 5 fields in the form and each have a data-testid for both
 * unit testing and end to end testing:
 * field                data-testid
 * email                email
 * password1            password
 * password2            confirm-password
 * yearsSpentTrading    years-spent-trading
 * howYouHeard          how-you-heard
 */
const SignUpForm = ({submitValues}: {submitValues: Function}) => {
    return(
        <Form
            title='Sign Up'
            initialValues={{
                email: '',
                password1: '',
                password2: '',
                yearsSpentTrading: yearsSpentTradingValues[0],
                howYouHeard: howYouHeardValues[0]
            }}
            validationSchema={Yup.object({
                email: Yup.string()
                    .email(FormMsg.invalidFieldErr('email'))
                    .required(FormMsg.fieldRequiredErr('email')),
                password1: Yup.string()
                    .min(FormConst.PASSWORD_MIN_LENGTH,
                        FormMsg.minLengthErr('password', FormConst.PASSWORD_MIN_LENGTH)
                    )
                    .max(FormConst.PASSWORD_MAX_LENGTH,
                        FormMsg.maxLengthErr('password', FormConst.PASSWORD_MAX_LENGTH)
                    )
                    .required(FormMsg.fieldRequiredErr('password')),
                password2: Yup.string()
                    .oneOf([Yup.ref('password1')], FormMsg.passwordNotMatchErr())
                    .required(FormMsg.fieldRequiredErr('confirm password')),
                yearsSpentTrading: Yup.string()
                    .required(FormMsg.fieldRequiredErr('years spent trading')),
                howYouHeard: Yup.string()
                    .required(FormMsg.fieldRequiredErr('how you heard'))
            })}
            onSubmit={({values, setErrors, setSubmitting, setSuccessMsg, setNonFieldError}) => {
                submitValues({
                    values,
                    successFunc: (resp: HttpResponseType) => {
                        setSuccessMsg(FormMsg.emailConfirmationSent());
                        setNonFieldError('');
                        ReactGA.event('sign_up', {
                            method: 'site sign up form'
                        })
                    },
                    errorFunc: (err: any) => {
                        try {
                            const errors = buildErrors(err.response.data, {
                                email: 'email',
                                password1: 'password1',
                                password2: 'password2',
                                yearsSpentTrading: 'yearsSpentTrading',
                                howYouHeard: 'howYouHeard'
                            });
                            setErrors(errors);
                            if(errors['non_field_errors']){
                                setNonFieldError(errors['non_field_errors'])
                            }
                            setSuccessMsg('')
                        } catch(err){
                            console.log(err);
                            setNonFieldError(HttpMsg.unexpectedErr())
                        }
                    },
                    thenFunc: () => setSubmitting(false)
                })
            }}>
        {({values, errors, isSubmitting, submitForm}) => (
            <>
                <TextInput name='email' placeholder='Email' type='email' data-testid='email' />
                <TextInput name='password1' placeholder='Password' type='password' data-testid='password' />
                <TextInput name='password2' placeholder='Confirm Password' data-testid='confirm-password'
                type='password' />
                <SelectInput name='yearsSpentTrading' data-testid='years-spent-trading'
                    placeholder='How long have you been trading?'
                    options={yearsSpentTradingValues} />
                <SelectInput name='howYouHeard' data-testid='how-you-heard'
                    placeholder='How did you hear about us?'
                    options={howYouHeardValues} />
                <Button
                    data-testid='submit-button'
                    onClick={canSubmit(errors, values) ? () => submitForm() : () => {}}
                    disabled={!canSubmit(errors, values)}>
                {isSubmitting ?
                    <LoadingIcon
                        color={getColor('white')} 
                        style={{padding: '3px'}} />
                    : 'Create Account'
                }
                </Button>
            </>
            )}
        </Form>
    )
}

const yearsSpentTradingValues = [
    'less than a year',
    '2 years',
    '3 - 5 years',
    'more than 5 years'
];

const howYouHeardValues = [
    'on social media',
    'through a friend',
    'on a trading group',
    'through a google search',
    'through an advertisement',
    'other'
];


export default SignUpForm