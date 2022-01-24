import {useState} from 'react'
import {Formik, Form, FormikErrors} from 'formik'
import * as Yup from 'yup'
import {CenterColumnBox} from '@components/containers'
import {Button} from '@components/buttons'
import {ErrorAlert, SuccessAlert} from '@components/alerts'
import {H4} from '@components/text'
import {HttpResponseType} from '@services/http'
import {FormMsg} from '@services/generic-msg'
import {getDimen} from '@conf/utils'
import {FormContainer, TextInput} from '@apps/info-app/components'
import {FormConst} from '@conf/const'
//import {LoginFormPropTypes} from './types'


const ChangePasswordForm = ({submitValues}: {submitValues: Function}) => {
    const [nonFieldErrors, setNonFieldErrors] = useState<string[]>([]);
    const [successMsg, setSuccessMsg] = useState('');

    return(
        <FormContainer>
            <H4 style={{
                marginBottom: getDimen('padding-sm')
            }}>Change Password</H4>
            <Formik
                initialValues={{
                    oldPassword: '',
                    newPassword: ''
                }}
                validationSchema={Yup.object({
                    oldPassword: Yup.string().required(FormMsg.fieldRequiredErr('password')),
                    newPassword: Yup.string()
                    .min(FormConst.PASSWORD_MIN_LENGTH,
                        FormMsg.minLengthErr('password', FormConst.PASSWORD_MIN_LENGTH)
                    )
                    .required(FormMsg.fieldRequiredErr('password')),
                })}
                onSubmit={(values, {setErrors, setSubmitting}) => {
                    submitValues({
                        values,
                        successFunc: (resp: HttpResponseType) => {
                            setSuccessMsg('An email has been sent to you.');
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
                                <TextInput name='oldPassword' placeholder='Old Password' type='password' />
                                <TextInput name='newPassword' placeholder='New Password' type='password' />
                                {
                                    isSubmitting ?
                                        <Button onClick={() => {}}>loading</Button>
                                        : canSubmit(errors, values) ?
                                            <Button onClick={submitForm}>
                                                Change Password</Button>
                                            : <Button onClick={() => {}}
                                                disabled={true}>
                                                Change Password</Button>
                                }
                            </CenterColumnBox>
                        </Form>
                    )}
            </Formik>
            </FormContainer>
    )
}


const canSubmit = (errors: FormikErrors<any>, values: { [key: string]: string }) => {
    if (!errors.oldPassword && values.oldPassword && !errors.newPassword && values.newPassword) {
        return true;
    }
    return false;
}

const buildErrors = (rawErrors: {[key: string]: string[]}, setNonFieldErrors: Function) => {
    let errors = {oldPassword: '', newPassword: ''};
    if('oldPassword' in rawErrors){
        rawErrors.email.forEach((error: string) => {
            errors.oldPassword += error;
        });
    }
    if('newPassword' in rawErrors){
        rawErrors.email.forEach((error: string) => {
            errors.newPassword += error;
        });
    }
    if('non_field_errors' in rawErrors) {
        rawErrors.non_field_errors.forEach((error: string) => {
            setNonFieldErrors((errors: string[]) => [...errors, error]);
        });
    }
    return errors;
}

export default ChangePasswordForm