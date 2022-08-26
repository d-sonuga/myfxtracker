import { SyntheticEvent, useState, useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import Navbar from '@components/navbar'
import Card from '@mui/material/Card'
import List from '@mui/material/List'
import {ListItemText} from '@mui/material'
import {BP, H3, P, H4, H5} from '@components/text'
import {Button} from '@components/buttons'
import { ReactNode } from 'react'
import { getDimen } from '@conf/utils'
import { Grid, GridProps } from '@mui/material'
import { Input } from '@components/inputs'
import {Http, HttpResponseType, HttpErrorType} from '@apps/trader-app/services'
import {HttpConst, RouteConst} from '@conf/const'
import {AffiliateData} from './../../use-affiliate-data'
import { ToastContext } from '@components/toast'
import LoadingIcon from '@components/loading-icon'
import {getColor} from '@conf/utils'


const Overview = ({affiliateData, setNewBankAccountNumber, setNewBankAccountName, setNewBankName}: {affiliateData: AffiliateData, setNewBankAccountNumber: (n: number) => void, setNewBankAccountName: (s: string) => void, setNewBankName: (s: string) => void}) => {
    const noOfSignUps = affiliateData.getNoOfSignUps().toString();
    const noOfSubscribers = affiliateData.getNoOfSubscribers().toString();
    const payout = `$${affiliateData.getNoOfSubscribers() * 5}`;
    const username = affiliateData.getUsername();
    const signUpLink = `https://myfxtracker.com/sign-up/${username}`;
    const navigate = useNavigate();
    const Toast = useContext(ToastContext);
    const saveNewBankAccountNumber = (newAccountNumber: string): Promise<void> => {
        const {BASE_URL, AFF_CHANGE_BANK_ACCOUNT_NUMBER_URL} = HttpConst;
        return new Promise((resolve, reject) => (
            Http.post({
                url: `${BASE_URL}/${AFF_CHANGE_BANK_ACCOUNT_NUMBER_URL}/`,
                data: {bank_account_number: newAccountNumber},
                successFunc: (resp: HttpResponseType) => {
                    resolve()
                },
                errorFunc: (err: HttpErrorType) => {
                    reject('error')
                },
                timeoutErrorFunc: () => {
                    reject('timeout')
                },
                networkErrorFunc: () => {
                    reject('network')
                }
            })
        ))
    }
    const saveNewBankAccountName = (newAccountName: string): Promise<void> => {
        const {BASE_URL, AFF_CHANGE_BANK_ACCOUNT_NAME_URL} = HttpConst;
        return new Promise((resolve, reject) => (
            Http.post({
                url: `${BASE_URL}/${AFF_CHANGE_BANK_ACCOUNT_NAME_URL}/`,
                data: {bank_account_name: newAccountName},
                successFunc: (resp: HttpResponseType) => {
                    resolve()
                },
                errorFunc: (err: HttpErrorType) => {
                    reject('error')
                },
                timeoutErrorFunc: () => {
                    reject('timeout')
                },
                networkErrorFunc: () => {
                    reject('network')
                }
            })
        ))
    }
    const saveNewBankName = (newBankName: string): Promise<void> => {
        const {BASE_URL, AFF_CHANGE_BANK_NAME_URL} = HttpConst;
        return new Promise((resolve, reject) => (
            Http.post({
                url: `${BASE_URL}/${AFF_CHANGE_BANK_NAME_URL}/`,
                data: {bank_name: newBankName},
                successFunc: (resp: HttpResponseType) => {
                    resolve()
                },
                errorFunc: (err: HttpErrorType) => {
                    reject('error')
                },
                timeoutErrorFunc: () => {
                    reject('timeout')
                },
                networkErrorFunc: () => {
                    reject('network')
                }
            })
        ))
    }
    const logout = (): Promise<void> => {
        const {BASE_URL, AFF_LOGOUT_URL} = HttpConst;
        return new Promise((resolve, reject) => (
            Http.delete({
                url: `${BASE_URL}/${AFF_LOGOUT_URL}/`,
                successFunc: (resp: HttpResponseType) => {
                    resolve();
                },
                errorFunc: (err: HttpErrorType) => {
                    reject();
                }
            })
        ))
    }
    return(
        <>
        <Container spacing={1} sx={{
            flexDirection: {
                xs: 'column',
                sm: 'row'
            }
        }}>
            <Grid item container xs={12} sm={6} sx={{
                    flexDirection: {
                        sm: 'row-reverse'
                    },
                    justifyContent: {
                        xs: 'center',
                        sm: 'flex-start'
                    }
                }}>
                <StatsCard
                    noOfSignUps={noOfSignUps}
                    noOfSubscribers={noOfSubscribers}
                    payout={payout} />
            </Grid>
            <Grid item container xs={12} sm={6} sx={{
                justifyContent: {
                    xs: 'center',
                    sm: 'flex-start'
                }
            }}>
                <InfoCard
                    title='Your Details'
                    listItems={[
                        <InfoListItem name='Username' value={username} />,
                        <InfoListItem name='Sign Up Link' value={signUpLink} />,
                        <EditableInfoListItem name='Bank Name' value={affiliateData.getBankName()}
                            blank={true}
                            type='string'
                            saveNewValue={saveNewBankName}
                            setNewValue={setNewBankName} />,
                        <EditableInfoListItem name='Bank Account Name' value={affiliateData.getBankAccountName()}
                            blank={true}
                            type='string'
                            saveNewValue={saveNewBankAccountName}
                            setNewValue={setNewBankAccountName} />,
                        <EditableInfoListItem name='Bank Account Number' value={affiliateData.getBankAccountNumber().toString()}
                            blank={false}
                            type='integer'
                            saveNewValue={saveNewBankAccountNumber}
                            setNewValue={(s: string) => setNewBankAccountNumber(parseInt(s))} />
                    ]}
                />
            </Grid>
        </Container>
        <Grid container sx={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: getDimen('padding-xs'),
            marginBottom: getDimen('padding-big')
            }}>
                <Button 
                    variant='outlined' 
                    style={{alignSelf: 'center'}}
                    onClick={() => {
                        const {AFF_APP_ROUTE, AFF_LOG_IN_ROUTE} = RouteConst;
                        logout()
                            .then(() => {
                                localStorage.removeItem('KEY');
                                navigate(`/${AFF_APP_ROUTE}/${AFF_LOG_IN_ROUTE}/`)
                            })
                            .catch(() => Toast.error('Something went wrong.'))
                    }}>Log Out</Button>
        </Grid>
        </>
    )
}

const StatsCard = ({noOfSignUps, noOfSubscribers, payout}: {noOfSignUps: string, noOfSubscribers: string, payout: string}) => {
    return(
        <InfoCard
            title='Your Stats'
            listItems={[
                <InfoListItem name='Sign Ups' value={noOfSignUps} />,
                <InfoListItem name='Subscribers' value={noOfSubscribers} />,
                <InfoListItem name='Payout' value={payout} />
            ]}
            />
    )
}

const InfoCard = ({title, listItems}: {title: string, listItems: ReactNode[]}) => {
    return(
        <Card sx={{width: '80%', padding: getDimen('padding-xs')}}>
            <H4 style={{textAlign: 'center'}}>{title}</H4>
            <List>
                {listItems}
            </List>
        </Card>
    )
}

const InfoListItem = ({name, value}: {name: string, value: string}) => {
    return (
        <ListItemText sx={{padding: getDimen('padding-xs')}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <P>{name}</P>
                <P>{value}</P>
            </div>
        </ListItemText>
    )
}

const EditableInfoListItem = ({name, value, saveNewValue, setNewValue, blank, type}: {name: string, value: string, saveNewValue: (s: string) => Promise<void>, setNewValue: (n: string) => void, blank: boolean, type: 'string' | 'integer'}) => {
    const [editing, setIsEditing] = useState(false);
    const [innerValue, setInnerValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const Toast = useContext(ToastContext);
    return(
        <ListItemText sx={{padding: getDimen('padding-xs')}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <P>{name}</P>
                <div style={{display: 'flex', alignItems: 'baseline'}}>
                    {editing ? 
                        <>
                            <Input 
                                hiddenLabel
                                size='small' value={innerValue} onChange={(e) => {
                                    const newValue = e.target.value;
                                    if(!isSaving){
                                        if(!blank && newValue.trim() === ''){
                                            return;
                                        }
                                        if(type === 'integer' && isInteger(newValue)){
                                            setInnerValue(newValue);
                                        } else {
                                            setInnerValue(newValue);
                                        }
                                    }
                                }}
                                style={{marginRight: getDimen('padding-xs')}} 
                                />
                            <Button
                                size='small' color='primary' variant='outlined'
                                style={{marginRight: '5px'}}
                                onClick={() => {
                                    setIsSaving(true);
                                    saveNewValue(innerValue)
                                        .then(() => {
                                            setNewValue(innerValue);
                                        })
                                        .catch((reason: 'network' | 'error' | 'timeout') => {
                                            setInnerValue(value);
                                            if(reason === 'error'){
                                                Toast.error('Something went wrong');
                                            }
                                        })
                                        .finally(() => {
                                            setIsSaving(false);
                                            setIsEditing(false);
                                        })
                                }}>{isSaving ? <LoadingIcon color={getColor('gray')} /> : 'Save'}</Button>
                            {!isSaving ?
                                    <Button
                                    size='small' color='error' variant='outlined'
                                    onClick={() => {
                                        setIsEditing(false);
                                        setInnerValue(value);
                                    }}>Cancel</Button>
                                : null
                            }
                        </>
                        : <>
                        {value}
                        <Button 
                            onClick={() => {
                                setIsEditing(true);
                                setInnerValue(value);
                            }}
                            style={{marginLeft: getDimen('padding-xs')}}>Edit</Button>
                        </>
                    }
                </div>
            </div>
        </ListItemText>
    )
}

const Container = ({children, sx, ...props}: {children: ReactNode} & GridProps) => {
    return(
        <>
        <Navbar links={[]} rightElement={<BP>Affiliate</BP>} />
        <Grid container sx={{marginTop: '80px', ...sx}} {...props}>
            {children}
        </Grid>
        </>
    )
}

const isInteger = (value: string) => {
    console.log(value);
    return /^\d+$/.test(value)
}

export default Overview