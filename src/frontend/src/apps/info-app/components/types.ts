import {ReactNode} from 'react'
import {FormikValues, FormikHelpers, FormikErrors} from 'formik'
import {ObjectSchema} from 'yup'

type FormPropTypes = {
    /**
     * The title of the form. The name that will be shown in bold above the fields
     */
    title: string,
    /**
     * The initial values to be used in the form
     */
    initialValues: {[key: string]: string},
    validationSchema: ObjectSchema<any, any, any, any>
    /**
     * The function to be run on submitting the form
     */
    onSubmit: {
        (utils: 
            Pick<FormUtils, 'values' | 'setNonFieldError' | 'setSuccessMsg'> &
            Pick<FormikHelpers<FormikValues>, 'setErrors' | 'setSubmitting'>
        ): void
    },
    /**
     * The fields and submit button to be displayed in the form
     */
    children: {
        (utils: FormUtils): ReactNode
    }
}

type FormUtils = {
    values: FormikValues,
    errors: FormikErrors<FormikValues>,
    isSubmitting: boolean,
    submitForm: Function
    setSuccessMsg: Function,
    setNonFieldError: Function
}

export type {
    FormPropTypes,
    FormUtils
}