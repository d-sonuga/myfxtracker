import {useState} from 'react'
import {useNavigate} from 'react-router'
import {Formik, Form, FormikErrors} from 'formik'
import * as Yup from 'yup'
import {CenterColumnBox} from '@components/containers'
import {Button} from '@components/buttons'
import {ErrorAlert} from '@components/alerts'
import {H4} from '@components/text'
import {HttpResponseType} from '@services/http'
import {getDimen} from '@conf/utils'
import {ConfigConst} from '@conf/const'
import {FormContainer, TextInput} from '@apps/info-app/components'
import {LoginFormPropTypes} from './types'


const LoginForm = ({submitValues, storageService}: LoginFormPropTypes) => {
    const navigate = useNavigate();
    const [nonFieldErrors, setNonFieldErrors] = useState<string[]>([]);

    return(
        <FormContainer>
            <H4 style={{
                marginBottom: getDimen('padding-sm')
            }}>Log In</H4>
            <Formik
                initialValues={{
                    email: '',
                    password: ''
                }}
                validationSchema={Yup.object({
                    email: Yup.string().email().required(),
                    password: Yup.string().required()
                })}
                onSubmit={(values, {setErrors, setSubmitting}) => {
                    submitValues({
                        values,
                        successFunc: (resp: HttpResponseType) => {
                            storageService.setItem(ConfigConst.TOKEN_KEY, resp.data.key);
                            navigate('/app');
                        },
                        errorFunc: (err: any) => {
                            const errors = buildErrors(err.response.data, setNonFieldErrors);
                            setErrors(errors);
                        },
                        thenFunc: () => setSubmitting(false)
                    })
                }}>
                    {({values, errors, isSubmitting, submitForm}) => (
                        <Form>
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
                                <TextInput name='password' placeholder='Password' type='password' />
                                {
                                    isSubmitting ?
                                        <Button onClick={() => {}}>loading</Button>
                                        : canSubmit(errors, values) ?
                                            <Button onClick={submitForm}>
                                                Log In</Button>
                                            : <Button onClick={() => {}}
                                                disabled={true}>
                                                Log In</Button>
                                }
                            </CenterColumnBox>
                        </Form>
                    )}
            </Formik>
            </FormContainer>
    )
}


const canSubmit = (errors: FormikErrors<any>, values: { [key: string]: string }) => {
    if (!errors.email && !errors.password && values.email && values.password) {
        return true;
    }
    return false;
}

const buildErrors = (rawErrors: {[key: string]: string[]}, setNonFieldErrors: Function) => {
    let errors = {email: '', password: ''};
    if('email' in rawErrors){
        rawErrors.email.forEach((error: string) => {
            errors.email += error;
        });
    }
    if('password' in rawErrors){
        rawErrors.password.forEach((error: string) => {
            if(errors.password){
                errors.password += `\n${error}`;
            } else {
                errors.password = error;
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

export default LoginForm