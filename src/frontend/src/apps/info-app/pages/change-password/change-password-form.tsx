import {useContext} from 'react'
import {Yup} from '@apps/info-app/components'
import {Button} from '@components/buttons'
import {HttpResponseType} from '@services/http'
import {FormMsg, HttpMsg} from '@services/generic-msg'
import {TextInput} from '@apps/info-app/components'
import {FormConst} from '@conf/const'
import LoadingIcon from '@components/loading-icon'
import {ToastContext} from '@components/toast'
import {buildErrors, canSubmit} from '@components/forms'
import {Form} from '@apps/info-app/components'


const ChangePasswordForm = ({submitValues}: {submitValues: Function}) => {
    const Toast = useContext(ToastContext);
    return(
        <Form
            title='Change Password'
            initialValues={{
                newPassword1: '',
                newPassword2: ''
            }}
            validationSchema={Yup.object({
                newPassword1: Yup.string()
                    .min(FormConst.PASSWORD_MIN_LENGTH,
                        FormMsg.minLengthErr('new password', FormConst.PASSWORD_MIN_LENGTH)
                    )
                    .max(FormConst.PASSWORD_MAX_LENGTH,
                        FormMsg.maxLengthErr('new password', FormConst.PASSWORD_MAX_LENGTH)
                    ) 
                    .required(FormMsg.fieldRequiredErr('new password')),
                newPassword2: Yup.string()
                    .oneOf([Yup.ref('newPassword1')], FormMsg.passwordNotMatchErr())
                    .required(FormMsg.fieldRequiredErr('confirm new password'))
            })}
            onSubmit={({values, setErrors, setSubmitting, setSuccessMsg, setNonFieldError}) => {
                const valuesToSubmit = {
                    new_password1: values.newPassword1,
                    new_password2: values.newPassword2
                }
                submitValues({
                    values: valuesToSubmit,
                    successFunc: (resp: HttpResponseType) => {
                        setSuccessMsg(FormMsg.passwordChangeSuccessful());
                        setNonFieldError('');
                    },
                    errorFunc: (err: any) => {
                        try {
                            const errors = buildErrors(err.response.data, {
                                'new_password1': 'newPassword1',
                                'new_password2': 'newPassword2'
                            })
                            setErrors(errors);
                            if(errors['non_field_error']){
                                setNonFieldError(errors['non_field_error']);
                            }
                        } catch (err){
                            // If the error response is not in json, buildErrors will
                            // result in a type error, because it is expecting json data
                            // This catch block handles the scenario where an unexpected error
                            // in html, not json, is returned from the server
                            setNonFieldError(HttpMsg.unexpectedErr());
                        }
                        setSuccessMsg('')
                    },
                    thenFunc: () => setSubmitting(false)
                })
            }}>
               {({values, errors, isSubmitting, submitForm}) => (
                   <>
                    <TextInput name='newPassword1' placeholder='New Password'
                        type='password' data-testid='new-password1' />
                    <TextInput name='newPassword2' placeholder='Confirm New Password'
                        type='password' data-testid='new-password2' />
                    <Button
                        onClick={canSubmit(errors, values) ? () => submitForm() : () => {}}
                        disabled={!canSubmit(errors, values)}
                        data-testid='submit-button'>
                        {isSubmitting ?
                            <LoadingIcon />
                            : 'Change Password'
                    }</Button>
                    </>
               )}
            </Form>
    );
}


export default ChangePasswordForm