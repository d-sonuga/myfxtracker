import {useState} from 'react'
import {Formik, Form as FormikForm, FormikConfig, FormikProps} from 'formik'
import {CenterColumnBox} from '@components/containers'
import {ErrorAlert, InfoAlert} from '@components/alerts'
import {H4} from '@components/text'
import {getDimen} from '@conf/utils'
import {FormContainer} from '@apps/info-app/components'
import {SuccessAlert} from '@components/alerts'
import {FormPropTypes} from './types'


const Form = ({title, initialValues, validationSchema, onSubmit, underTitleComponent, children, ...props}: FormPropTypes) => {
    const [successMsg, setSuccessMsg] = useState('');
    const [nonFieldError, setNonFieldError] = useState('');
    const [infoMsg, setInfoMsg] = useState('');

    return(
        <FormContainer>
            <H4 style={{
                marginBottom: getDimen('padding-sm')
            }}>{title}</H4>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, {setErrors, setSubmitting}) => onSubmit({
                    values,
                    setErrors,
                    setSubmitting,
                    setSuccessMsg,
                    setNonFieldError,
                    setInfoMsg
                })}
                {...props}>
                    {({values, errors, isSubmitting, submitForm, ...others}: FormikProps<any>) => (
                        <FormikForm>
                            {underTitleComponent}
                            {
                                successMsg.length ?
                                    <SuccessAlert
                                        style={{marginBottom: getDimen('padding-xs')}}
                                        data-testid='success-alert'>
                                        {successMsg}
                                    </SuccessAlert>
                                    : null
                            }
                            {
                                nonFieldError.length ?
                                    <ErrorAlert
                                        style={{marginBottom: getDimen('padding-xs')}}
                                        data-testid='non-field-error-alert'>
                                        {nonFieldError}
                                    </ErrorAlert>
                                    : null
                            }
                            {
                                infoMsg.length ?
                                    <InfoAlert
                                        style={{marginBottom: getDimen('padding-xs')}}
                                        data-testid='info-alert'>
                                            {infoMsg}
                                    </InfoAlert>
                                    : null
                            }
                            <CenterColumnBox>
                                {children({
                                    values,
                                    errors,
                                    isSubmitting,
                                    submitForm,
                                    setSuccessMsg,
                                    nonFieldError,
                                    setNonFieldError,
                                    setInfoMsg,
                                    ...others,
                                })}
                            </CenterColumnBox>
                        </FormikForm>
                    )}
            </Formik>
            </FormContainer>
    )
}

export default Form