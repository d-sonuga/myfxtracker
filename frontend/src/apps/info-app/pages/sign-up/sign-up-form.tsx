import {useState} from 'react'
import {Formik, Form, FormikErrors} from 'formik'
import * as Yup from 'yup'
import {CenterColumnBox} from '@components/containers'
import {Button} from '@components/buttons'
import {H4, P} from '@components/text'
import {getColor, getDimen} from '@conf/utils'
import {FormConst} from '@conf/const'
import {FormMsg} from '@services/generic-msg'
import {FormContainer, SelectInput, TextInput} from '@apps/info-app/components'
import {ErrorAlert, SuccessAlert} from '@components/alerts'
import LoadingIcon from '@components/loading-icon'
import {HttpResponseType} from '@services/http'


const SignUpForm = ({submitValues}: {submitValues: Function}) => {
    /** 
     * To hold the success message that results from a successful sign up
     * When empty, no success alert is displayed
     * When not empty, a success alert with the content is displayed in the form
    */
    const [successMsg, setSuccessMsg] = useState<string>('');
    /** An array of all non field errors reported back from the server after submitting form */
    const [nonFieldErrors, setNonFieldErrors] = useState<string[]>([]);

    return(
        <FormContainer>
            <H4 style={{
                marginBottom: getDimen('padding-sm')
            }}>Sign Up</H4>
            <P style={{color: 'gray'}}>Please fill in your details below</P>
            <Formik
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
                        .required(FormMsg.fieldRequiredErr('password')),
                    password2: Yup.string()
                        .oneOf([Yup.ref('password1')], FormMsg.passwordNotMatchErr())
                        .required(FormMsg.fieldRequiredErr('confirm password')),
                    yearsSpentTrading: Yup.string()
                        .required(FormMsg.fieldRequiredErr('years spent trading')),
                    howYouHeard: Yup.string()
                        .required(FormMsg.fieldRequiredErr('how you heard'))
                })}
                onSubmit={(values, {setErrors, setSubmitting}) => {
                    submitValues({
                        values,
                        successFunc: (resp: HttpResponseType) => {
                            setSuccessMsg(FormMsg.emailConfirmationSent());
                            setNonFieldErrors([]);
                            setSubmitting(false)
                        },
                        errorFunc: (err: any) => {
                            const errors = buildErrors(err.response.data, setNonFieldErrors);
                            setSuccessMsg('');
                            setErrors(errors);
                        },
                        thenFunc: () => setSubmitting(false)
                    })
                }}>
                    {({values, errors, isSubmitting, submitForm}) => (
                        <Form>
                            {
                                successMsg ? 
                                    <SuccessAlert style={{marginBottom: getDimen('padding-xs')}}>
                                        {successMsg}
                                    </SuccessAlert>
                                    : null
                            }
                            {
                                nonFieldErrors.length ? 
                                    <ErrorAlert style={{marginBottom: getDimen('padding-xs')}}>
                                        {nonFieldErrors.map((errorMsg, i) => (
                                            `${i === 0 ? '' : '\n'}${errorMsg}`
                                            ))}
                                    </ErrorAlert>
                                    : null
                            }
                            <CenterColumnBox>
                                <TextInput name='email' placeholder='Email' type='email' />
                                <TextInput name='password1' placeholder='Password' type='password' />
                                <TextInput name='password2' placeholder='Confirm Password' 
                                type='password' />
                                <SelectInput name='yearsSpentTrading' 
                                    placeholder='How long have you been trading?'
                                    options={yearsSpentTradingValues} />
                                <SelectInput name='howYouHeard' 
                                    placeholder='How did you hear about us?'
                                    options={howYouHeardValues} />
                                {
                                    isSubmitting ?
                                            <Button onClick={submitForm}>
                                                <LoadingIcon size={30} 
                                                    color={getColor('white')} 
                                                    style={{padding: '3px'}} />
                                            </Button>
                                        : canSubmit(errors, values) ?
                                            <Button onClick={submitForm}
                                            disabled={false}>
                                            Create Account</Button>
                                            : <Button onClick={() => {}}
                                                disabled={true}>
                                                Create Account</Button>
                                }
                            </CenterColumnBox>
                        </Form>
                    )}
            </Formik>
            </FormContainer>
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

const canSubmit = (errors: FormikErrors<any>, values: { [key: string]: string }) => {   
    if (!errors.email && !errors.password1 && !errors.password2 && !errors.yearsSpentTrading
        && !errors.howYouHeard && values.email && values.password1 && values.password2
        && values.howYouHeard && values.yearsSpentTrading) {
        return true;
    }
    return false;
}


/**
 * A function to convert the raw errors gotten from the server after submitting a form
 * to the error object for rendering by the form
 * @param rawErrors: the object of errors gotten from the server
 * @param setNonFieldErrors: a function to set the non field errors
 * @returns the newly built object of errors ready for rendering by the form
 */
const buildErrors = (rawErrors: {[key: string]: string[]}, setNonFieldErrors: Function) => {
    let errors = {email: '', password1: '', password2: ''};
    if('email' in rawErrors){
        rawErrors.email.forEach((error: string) => {
            errors.email += error;
        });
    }
    /** password is processed as  */
    if('password1' in rawErrors){
        rawErrors.password1.forEach((error: string) => {
            /** If an error has already been added, put the next on a new line */
            if(errors.password1){
                errors.password1 += `\n${error}`;
            } else {
                errors.password1 = error;
            }
        });
    }
    if('password2' in rawErrors){
        rawErrors.password2.forEach((error: string) => {
            /** If an error has already been added, put the next on a new line */
            if(errors.password2){
                errors.password2 += `\n${error}`;
            } else {
                errors.password2 = error;
            }
        });
    }
    if('non_field_errors' in rawErrors) {
        rawErrors.non_field_errors.forEach((error: string) => {
            setNonFieldErrors((errors: string[]) => [...errors, error]);
        });
    }
    return errors;
}

export default SignUpForm