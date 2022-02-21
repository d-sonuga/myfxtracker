/**
 * Form values to be submit along with config
 */
type SubmitValues = {
    url: string,
    values: {[key: string]: string}
    successFunc: Function,
    errorFunc: Function,
    thenFunc: Function
}

export type {
    SubmitValues
}