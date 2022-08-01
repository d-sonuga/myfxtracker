import {useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router'
import ReactGA from 'react-ga4'
import {Yup} from '@apps/info-app/components'
import {Button} from '@components/buttons'
import {getColor} from '@conf/utils'
import {FormMsg, HttpMsg} from '@services/generic-msg'
import {FileInput, SelectInput, TextInput, Form} from '@components/forms'
import LoadingIcon from '@components/loading-icon'
import {HttpResponseType} from '@services/http'
import {buildErrors, canSubmit as baseCanSubmit} from '@components/forms'
import {ConfigConst, RouteConst} from '@conf/const'
import {RawData} from '@apps/trader-app/models/types'
import {P, SBP} from '@components/text'
import {ColumnBox} from '@components/containers'
import {FormikErrors, FormikProps} from 'formik'
import {getDimen} from '@conf/utils'
import {AddAccountFormPropTypes} from './types'
import { PermissionsObj } from '@apps/trader-app/services/types'
import { FormUtils } from '@components/forms/types'

/**
 */

const AddAccountForm = ({
    submitValues, onAccountAdded, noOfAccounts, userIsOnFreeTrial, permissions
}: AddAccountFormPropTypes) => {
    const navigate = useNavigate();
    const [brokerNotSupportedProcessNeeded, setBrokerNotSupportedProcessNeeded] = useState(false);
    const formInitialValues: FormInitialValues = {
        name: '',
        login: '',
        password: '',
        server: '',
        platform: platforms[0],
        brokerInfo: null
    }
    return(
        <Form
            title='Add Account'
            initialValues={formInitialValues}
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
                    .oneOf(platforms),
                brokerInfo: Yup.mixed()
                    .test('fileUploaded', 'The file is required', (value) => {
                        if(!value && brokerNotSupportedProcessNeeded){
                            return false;
                        }
                        return true;
                    })
                    .test('fileSize', 'The file is too big', (value) => {
                        console.log('validSize', value);
                        if(brokerNotSupportedProcessNeeded){
                            if(value && value.size >= 500000){
                                return false;
                            }
                        }
                        return true;
                    })
                    .test('correctBrokerInfoFileMt4',
                        'Should be a .srv file for mt4. Change mt version to 5 to upload .dat file',
                        (value, context) => {
                        if(brokerNotSupportedProcessNeeded){
                            if(value && value.name.endsWith('.dat') && context.parent.platform === 'mt4'){
                                return false;
                            }
                        }
                        return true;
                    })
                    .test('correctBrokerInfoFileMt5',
                        'Should be a .dat file for mt5. Change mt version to 4 to upload .srv file',
                        (value, context) => {
                        if(brokerNotSupportedProcessNeeded){
                            if(value && value.name.endsWith('.srv') && context.parent.platform === 'mt5'){
                                return false;
                            }
                        }
                        return true;
                    })
                    .test('validSrvFile',
                        'Should be a .srv file',
                        (value, context) => {
                        if(brokerNotSupportedProcessNeeded){
                            if(value && !value.name.endsWith('.srv') && context.parent.platform === 'mt4'){
                                return false;
                            }
                        }
                        return true;
                    })
                    .test('validDatFile',
                        'Should be a .dat file',
                        (value, context) => {
                        if(brokerNotSupportedProcessNeeded){
                            if(value && !value.name.endsWith('.dat') && context.parent.platform === 'mt5'){
                                return false;
                            }
                        }
                        return true;
                    })
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
                let processedValues;
                if(!values.brokerInfo){
                    processedValues = Promise.resolve(values);
                } else {
                    const fileName = values.brokerInfo.name;
                    processedValues = toBase64(values.brokerInfo)
                        .then((brokerInfo) => {
                            return Promise.resolve({
                                ...values,
                                brokerInfoContent: brokerInfo,
                                brokerInfoName: fileName
                            })
                        })
                        .catch((err) => {
                            console.log(err);
                            setInfoMsg('');
                            setSubmitting(false);
                            setNonFieldError('Sorry. An unexpected error occured.');
                        })
                }
                processedValues.then((values) => {
                    console.log(values);
                    submitValues({
                        values,
                        successFunc: submitValuesSuccessFunc(setNonFieldError, onAccountAdded, navigate),
                        errorFunc: submitValuesErrorFunc(
                            setBrokerNotSupportedProcessNeeded,
                            setErrors, setNonFieldError, setSuccessMsg
                        ),
                        thenFunc: () => {
                            setSubmitting(false);
                            setInfoMsg('');
                        }
                    })
                })
            }}
            underTitleComponent={(() => {
                console.log('In add account form', permissions);
                if(!permissions.canAddAccount){
                    return(
                        <P style={{textAlign: 'center', marginBottom: getDimen('padding-xs')}}>
                            You cannot add any accounts
                        </P>
                    )
                }
            })()}>
        {({values, errors, isSubmitting, submitForm}: FormUtils) => {
            return (
            <>
                <TextInput name='name' placeholder='Account Name' data-testid='name' />
                <TextInput name='login' placeholder='Login' data-testid='login' />
                <TextInput name='password' placeholder='Investor Password' type='password' 
                    data-testid='password' />
                <TextInput name='server' placeholder='Server' data-testid='server' />
                <SelectInput name='platform' data-testid='platform'
                    placeholder='MetaTrader Platform Version'
                    options={platforms} />
                <ColumnBox style={{display: brokerNotSupportedProcessNeeded ? 'inline' : 'none'}}>
                    <P>
                        File: {values.brokerInfo && values.brokerInfo.name && values.brokerInfo.name.length 
                                ? values.brokerInfo.name : 'None'}
                    </P>
                    <FileInput name='brokerInfo' data-testid='broker-info'
                        placeholder={
                            values.brokerInfo && values.brokerInfo.name && values.brokerInfo.name.length ?
                            'Change Broker Info' : 'Upload Broker Info'
                        }
                        accept='.srv, .dat'/> 
                    <SBP style={{color: getColor('primary-blue'), marginTop: getDimen('padding-xs'),
                        marginBottom: getDimen('padding-xs')}}>
                        {values.platform === 'mt4' ? 
                            'Your broker .srv file (mt4)'
                            : 'Your server .dat file (mt5)'}
                    </SBP>
                </ColumnBox>
                <Button
                    data-testid='submit-button'
                    onClick={canSubmit(errors, values, permissions) ? () => submitForm() : () => {}}
                    disabled={!canSubmit(errors, values, permissions)}>
                {isSubmitting ?
                    <LoadingIcon
                        color={getColor('white')} 
                        style={{padding: '3px'}} />
                    : 'Add Account'
                }
                </Button>
            </>
            )}}
        </Form>
    )
}

const canSubmit = (
    errors: FormikErrors<any>,
    values: {[key: string]: any},
    permissions: PermissionsObj
): boolean => {
    return permissions.canAddAccount && baseCanSubmit(errors, values)
}

const submitValuesSuccessFunc = (setNonFieldError: Function, onAccountAdded: Function, navigate: Function) => {
    return (data: RawData) => {
        setNonFieldError('');
        ReactGA.event('add_account', {
            method: 'site '
        });
        //ReactGA.
        onAccountAdded(data);
        navigate(`/${RouteConst.TRADER_APP_ROUTE}/`);
    }
}

const submitValuesErrorFunc = (setBrokerNotSupportedProcessNeeded: Function, 
    setErrors: Function, setNonFieldError: Function, setSuccessMsg: Function) => {
    return (err: any) => {
        try {
            const errors: {[key: string]: string} = buildErrors(err.response.data, {
                login: 'login',
                server: 'server',
                password: 'password',
                platform: 'platform'
            });
            if(errors['non_field_errors']){
                if(errors['non_field_errors'].includes('unknown error')){
                    const unknownErrorMsg = 'An error occured. ' +
                        'Please, ensure the details you entered are precisely ' +
                        'correct and try again. If this error persists, please ' +
                        'contact support.';
                    errors['non_field_errors'] = unknownErrorMsg;
                }
            }
            if('server' in errors){
                if(errors['server'].includes('not supported')){
                    errors['server'] = '';
                    const serverErrorMsg = 'Unable to perform automatic broker detection. ' +
                        'Please upload your broker .srv file (mt4) or servers .dat file ' +
                        '(mt5) in the last field.';
                    if(errors['non_field_errors'] && errors['non_field_errors'].length){
                        errors['non_field_errors'] += `\n${serverErrorMsg}`;
                    } else {
                        errors['non_field_errors'] = serverErrorMsg;
                    }
                    setBrokerNotSupportedProcessNeeded(true);
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
    }
}

const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            let result = fileReader.result;
            if(typeof(result) === 'string'){
                const THE_DATA = 1;
                result = result.split('data:application/octet-stream;base64,')[THE_DATA];
            }
            resolve(result);
        }
        fileReader.onerror = (err: any) => {
            reject(err);
        }
    })
}

const platforms: ['mt4', 'mt5'] = [
    'mt4',
    'mt5'
];

type FormInitialValues = {

    name: string,
    login: string,
    password: string,
    server: string,
    platform: 'mt4' | 'mt5',
    brokerInfo: File | null
}

export default AddAccountForm