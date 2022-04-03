import {useContext} from 'react'
import {useNavigate} from 'react-router'
import ReactGA from 'react-ga4'
import {Yup} from '@apps/info-app/components'
import {Button} from '@components/buttons'
import {getColor} from '@conf/utils'
import {FormMsg, HttpMsg} from '@services/generic-msg'
import {SelectInput, TextInput, Form} from '@components/forms'
import LoadingIcon from '@components/loading-icon'
import {HttpResponseType} from '@services/http'
import {buildErrors, canSubmit} from '@components/forms'
import {ToastContext} from '@components/toast'
import {ConfigConst, RouteConst} from '@conf/const'


/**
 */

const AddAccountForm = ({
    submitValues, onAccountAdded, noOfAccounts, userIsOnFreeTrial
}: {submitValues: Function, onAccountAdded: Function, noOfAccounts: number, userIsOnFreeTrial: boolean}) => {
    const navigate = useNavigate();
    return(
        <Form
            title='Add Account'
            initialValues={{
                name: '',
                login: '',
                password: '',
                server: '',
                platform: platforms[0]
            }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .required('Please enter the account name'),
                login: Yup.number()
                    .integer('Please enter a valid login number')
                    .moreThan(0, 'Please enter a valid login number')
                    .positive('Please enter a valid login number')
                    .typeError('Please enter a valid login number')
                    .required(FormMsg.fieldRequiredErr('login')),
                password: Yup.string()
                    .min(5, 'Please enter a valid investor password')
                    .required(FormMsg.fieldRequiredErr('password')),
                server: Yup.string()
                    .test('notDemo', 'Account cannot be a demo account', (value?: string): boolean => {
                        if(value?.toLowerCase().includes('demo')){
                            //return false;
                            return true;
                        } else {
                            return true;
                        }
                    })
                    .required(FormMsg.fieldRequiredErr('server')),
                platform: Yup.string()
                    .required(FormMsg.fieldRequiredErr('years spent trading'))
                    .oneOf(platforms)
            })}
            onSubmit={({values, setErrors, setSubmitting, setSuccessMsg, setNonFieldError, setInfoMsg}) => {
                if(userIsOnFreeTrial){
                    if(noOfAccounts >= ConfigConst.MAX_NO_OF_TRADING_ACCOUNT_FREE_TRIAL_TRADER){
                        setNonFieldError('You have reached the maximum number of accounts you can add.');
                        setSubmitting(false);
                        return;
                    }
                } else {
                    if(noOfAccounts >= ConfigConst.MAX_NO_OF_TRADING_ACCOUNT_SUBSCRIBED_TRADER){
                        setNonFieldError('You have reached the maximum number of accounts you can add.');
                        setSubmitting(false);
                        return;
                    }
                }
                setNonFieldError('');
                setInfoMsg('Please wait. This could take several minutes.');
                submitValues({
                    values,
                    successFunc: (resp: HttpResponseType) => {
                        setNonFieldError('');
                        /*
                        ReactGA.event('add_account', {
                            method: 'site '
                        })
                        */
                        onAccountAdded(resp.data);
                        navigate(`/${RouteConst.TRADER_APP_ROUTE}/`);
                    },
                    errorFunc: (err: any) => {
                        try {
                            const errors: {[key: string]: string} = buildErrors(err.response.data, {
                                login: 'login',
                                server: 'server',
                                password: 'password',
                                platform: 'platform'
                            });
                            if(errors['non_field_errors']){
                                if(errors['non_field_errors'].includes('unknown error')){
                                    const unknownErrorMsg = 'An unknown error occured. ' +
                                        'Please, ensure the details you entered are precisely ' +
                                        'correct and try again. If this error persists, please ' +
                                        'contact support.';
                                    errors['non_field_errors'] = unknownErrorMsg;
                                }
                            }
                            if('server' in errors){
                                if(errors['server'].includes('not supported')){
                                    errors['server'] = '';
                                    const serverErrorMsg = 'Your broker is probably not supported. ' +
                                        'Please ensure the server you entered is precisely correct ' +
                                        'and try again. If this error persists, please contact support.';
                                    if(errors['non_field_errors'] && errors['non_field_errors'].length){
                                        errors['non_field_errors'] += `\n${serverErrorMsg}`;
                                    } else {
                                        errors['non_field_errors'] = serverErrorMsg;
                                    }
                                }
                            }
                            setErrors(errors);
                            if(errors['non_field_errors']){
                                setNonFieldError(errors['non_field_errors'])
                            }
                            setSuccessMsg('')
                        } catch(err){
                            console.log(err);
                            setNonFieldError(
                                'An error occured. ' +
                                'Please check your credentials and ' +
                                'make sure they are precisely correct. ' +
                                'If this error persists, please contact support.'
                            );
                        }
                    },
                    thenFunc: () => {
                        setSubmitting(false);
                        setInfoMsg('');
                    }
                })
            }}>
        {({values, errors, isSubmitting, submitForm}) => (
            <>
                <TextInput name='name' placeholder='Account Name' data-testid='name' />
                <TextInput name='login' placeholder='Login' data-testid='login' />
                <TextInput name='password' placeholder='Investor Password' type='password' 
                    data-testid='password' />
                <TextInput name='server' placeholder='Server' data-testid='server' />
                <SelectInput name='platform' data-testid='platform'
                    placeholder='MetaTrader Platform Version'
                    options={platforms} />
                <Button
                    data-testid='submit-button'
                    onClick={canSubmit(errors, values) ? () => submitForm() : () => {}}
                    disabled={!canSubmit(errors, values)}>
                {isSubmitting ?
                    <LoadingIcon
                        color={getColor('white')} 
                        style={{padding: '3px'}} />
                    : 'Add Account'
                }
                </Button>
            </>
            )}
        </Form>
    )
}

const platforms = [
    'mt4',
    'mt5'
];



export default AddAccountForm