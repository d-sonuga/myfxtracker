/** Type of the config used by the sign up form to submit form values */
type SubmitValuesTypes = {
    /** object of values to be submitted */
    values: {
        [key: string]: string
    },
    /** function to be called on success response */
    successFunc: Function,
    /** function to be called on errors */
    errorFunc: Function,
    /** function to be called after an attempt to submit, 
     * whether it was a success or failure 
     * */
    thenFunc: Function
}

type LoginFormPropTypes = {
    submitValues: Function, 
    storageService: {
        [key: string]: any,
        setItem: (key: string, value: any) => void
    },
    navigate: Function
}

export type {
    SubmitValuesTypes,
    LoginFormPropTypes,
}