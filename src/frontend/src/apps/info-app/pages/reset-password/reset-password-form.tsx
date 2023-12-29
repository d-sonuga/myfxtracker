import {Yup} from '@apps/info-app/components'
import {Button} from '@components/buttons'
import {HttpResponseType} from '@services/http'
import {Form, TextInput} from '@apps/info-app/components'
import LoadingIcon from '@components/loading-icon'
import {canSubmit, buildErrors} from '@components/forms'
import {FormMsg, HttpMsg} from '@services/generic-msg'
import { FormikProps } from 'formik'
import { ConfigConst } from '@conf/const'


const ResetPasswordForm = ({submitValues}: {submitValues: Function}) => {
    return(            
        <Form
            title='Reset Password'
            initialValues={{
                email: ''
            }}
            validationSchema={Yup.object({
                email: Yup.string()
                    .email()
                    .required(FormMsg.fieldRequiredErr('email'))
            })}
            onSubmit={({values, setErrors, setSubmitting, setSuccessMsg, setNonFieldError}) => {
                submitValues({
                    values,
                    successFunc: (resp: HttpResponseType) => {
                        setNonFieldError('');
                        setSuccessMsg(FormMsg.emailPasswordResetSent())
                    },
                    errorFunc: (err: any) => {
                        try {
                            const errors = buildErrors(err.response.data, {
                                email: 'email'
                            });
                            setErrors(errors);
                            if(errors['non_field_errors']){
                                setNonFieldError(errors['non_field_errors'])
                            }
                        } catch(err){
                            setNonFieldError(HttpMsg.unexpectedErr());
                        }
                        setSuccessMsg('')
                    },
                    thenFunc: () => setSubmitting(false)
                })
            }}>
            {({values, errors, isSubmitting, submitForm}: FormikProps<any>) => (
                    <>
                    <TextInput name='email' placeholder='Email' type='email' data-testid='email' />
                    <Button
                        onClick={!ConfigConst.IS_ARCHIVE && canSubmit(errors, values) ? 
                            () => submitForm() : () => {}}
                        disabled={ConfigConst.IS_ARCHIVE || !canSubmit(errors, values)}
                        data-testid='submit-button'>
                            {isSubmitting ?
                                <LoadingIcon />
                                : 'Reset Password'
                            }
                        </Button>
                    </>
            )}
        </Form>
    )
}


export default ResetPasswordForm