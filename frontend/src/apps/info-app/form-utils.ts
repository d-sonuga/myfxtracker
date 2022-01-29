import {FormikErrors} from 'formik'

/**
 * @param rawErrors the json response from the server mapping rawError fields to their array of errors
 * @param rawToRefinedFieldMapping a json object mapping rawError fields to refinedError fields
 *  for example, if rawErrors is {'user-email': ['An error]} and rawToRefinedFieldMapping is
 *  {'user-email': 'email'}, then the object returned will be {'email': 'An error'}
 */
const buildErrors = (rawErrors: {[key: string]: string[]}, rawToRefinedFieldMapping: {[key: string]: string}) => {
    const refinedErrors: {[key: string]: string} = {}
    rawToRefinedFieldMapping['non_field_errors'] = 'non_field_errors';
    for(const key of Object.keys(rawErrors)){
        rawErrors[key].forEach((err) => {
            if(refinedErrors[rawToRefinedFieldMapping[key]] === undefined){
                refinedErrors[rawToRefinedFieldMapping[key]] = ''
            }
            refinedErrors[rawToRefinedFieldMapping[key]] += err
        })
    }
    return refinedErrors
}

/**
 * Function to determine whether or not a form can be submitted
 * @param errors object mapping field names to field error messages
 * @param values object mapping field names to values user has entered into fields
 * @param notRequired an optional array, specifying field names of fields that are not required
 * @returns boolean
 */
const canSubmit = (errors: FormikErrors<any>, values: {[key: string]: string}, notRequired: string[] = []) => {
    if(Object.keys(values).length === 0){
        return false;
    }
    for(const fieldName of Object.keys(errors)){
        if(errors[fieldName]){
            return false
        }
        if(!notRequired.includes(fieldName)){
            if(!values[fieldName].length){
                return false
            }
        }
    }
    return true
}

export {
    buildErrors,
    canSubmit
}