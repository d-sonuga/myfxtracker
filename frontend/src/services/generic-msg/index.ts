/*
* For generic messages used throughout the app, mostly errors and success messages
*/

const FormMsg = {
    fieldRequiredErr: (field: string) => `${field} is required`,
    minLengthErr: (field: string, min: number) => `${field} should be at least ${min} characters`,
    maxLengthErr: (field: string, max: number) => `${field} should not be more than ${max} characters`,
    passwordNotMatchErr: () => 'passwords don\'t match',
    emailConfirmationSent: () => 'An email has been sent.',
    emailPasswordResetSent: () => 'An email has been sent.',
    invalidFieldErr: (field: string) => `${field} is invalid`,
    passwordChangeSuccessful: () => 'Your password has been changed',
    passwordResetSuccessful: () => 'Your password has been reset'
}

const HttpMsg = {
    noConnectionErr: () => 'The server is unreachable. Please check your internet connection and try again.',
    connectionTimeOutErr: () => 'It\'s taking a while to reach the server. Please check your ' +
        'connection and try again.',
    unexpectedErr: () => 'We\'re sorry. An unexpected error occured.',
    unknownErr: () => 'There was an unknown error'
}

export {FormMsg, HttpMsg}
