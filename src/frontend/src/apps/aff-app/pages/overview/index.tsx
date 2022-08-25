import { SyntheticEvent, useState, useContext } from 'react'
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
import {HttpConst} from '@conf/const'
import {AffiliateData} from './../../use-affiliate-data'
import { ToastContext } from '@components/toast'
import LoadingIcon from '@components/loading-icon'


const Overview = ({affiliateData}: {affiliateData: AffiliateData}) => {
    const noOfSignUps = affiliateData.getNoOfSignUps().toString();
    const noOfSubscribers = affiliateData.getNoOfSubscribers().toString();
    const payout = `$${affiliateData.getNoOfSubscribers() * 5}`;
    const username = affiliateData.getUsername();
    const signUpLink = `https://myfxtracker.com/sign-up/${username}`;
    let rawBankAccountNumber = affiliateData.getBankAccountNumber();
    const bankAccountNumber = rawBankAccountNumber !== undefined && rawBankAccountNumber !== null ?
        rawBankAccountNumber.toString() : '0';
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
                    reject()
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
                <DetailsCard
                    username={username}
                    signUpLink={signUpLink}
                    bankAccountNumber={bankAccountNumber}
                    saveNewBankAccountNumber={saveNewBankAccountNumber} />
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
                        // Call a logout function
                    }}>Log Out</Button>
        </Grid>
        </>
    )
}

const DetailsCard = ({username, signUpLink, bankAccountNumber, saveNewBankAccountNumber}: {username: string, signUpLink: string, bankAccountNumber: string, saveNewBankAccountNumber: (s: string) => Promise<void>}) => {
    return(
        <InfoCard
            title='Your Details'
            listItems={[
                <InfoListItem name='Username' value={username} />,
                <InfoListItem name='Sign Up Link' value={signUpLink} />,
                <EditableInfoListItem name='Bank Account number' value={bankAccountNumber}
                    saveNewValue={saveNewBankAccountNumber} />
            ]}
        />
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

const EditableInfoListItem = ({name, value, saveNewValue}: {name: string, value: string, saveNewValue: (s: string) => Promise<void>}) => {
    const [editing, setIsEditing] = useState(false);
    const [oldValue, setOldValue] = useState(value);
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
                                    if(isInteger(newValue) && !isSaving){
                                        setInnerValue(newValue);
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
                                        .then(() => setOldValue(innerValue))
                                        .catch(() => {
                                            Toast.error('Something went wrong')
                                        })
                                        .finally(() => {
                                            setIsSaving(false);
                                            setIsEditing(false);
                                        })
                                }}>{isSaving ? <LoadingIcon /> : 'Save'}</Button>
                            {!isSaving ?
                                    <Button
                                    size='small' color='error' variant='outlined'
                                    onClick={() => {
                                        setIsEditing(false);
                                        setInnerValue(oldValue);
                                    }}>Cancel</Button>
                                : null
                            }
                        </>
                        : <>
                        {value}
                        <Button 
                            onClick={() => setIsEditing(true)}
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