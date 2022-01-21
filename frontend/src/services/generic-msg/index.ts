/*
* For generic messages used throughout the app, mostly errors and success messages
*/

const FormMsg = {
    fieldRequiredErr: (field: string) => `${field} is required`,
    minLengthErr: (field: string, min: number) => `${field} should be at least ${min} characters`,
    passwordNotMatchErr: () => 'Passwords don\'t match',
    emailConfirmationSent: () => 'An email has been sent.',
    invalidFieldErr: (field: string) => `${field} is invalid`
}

const HttpMsg = {
    noConnectionErr: () => 'The server is unreachable. Please check your internet connection and try again.',
    connectionTimeOutErr: () => 'It\'s taking a while to reach the server. Please check your ' +
        'connection and try again.'
}

export {FormMsg, HttpMsg}
