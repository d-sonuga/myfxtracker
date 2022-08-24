import { SyntheticEvent, useState } from 'react'
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
import {AffiliateData} from './../../use-affiliate-data'


const Overview = ({affiliateData}: {affiliateData: AffiliateData}) => {
    const noOfSignUps = affiliateData.getNoOfSignUps().toString();
    const noOfSubscribers = affiliateData.getNoOfSubscribers().toString();
    const payout = `$${affiliateData.getNoOfSubscribers() * 5}`;
    const username = affiliateData.getUsername();
    const signUpLink = `https://myfxtracker.com/sign-up/${username}`;
    let rawBankAccountNumber = affiliateData.getBankAccountNumber();
    const bankAccountNumber = rawBankAccountNumber !== undefined && rawBankAccountNumber !== null ?
        rawBankAccountNumber.toString() : '0';
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
                    bankAccountNumber={bankAccountNumber} />
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

const DetailsCard = ({username, signUpLink, bankAccountNumber}: {username: string, signUpLink: string, bankAccountNumber: string}) => {
    return(
        <InfoCard
            title='Your Details'
            listItems={[
                <InfoListItem name='Username' value={username} />,
                <InfoListItem name='Sign Up Link' value={signUpLink} />,
                <EditableInfoListItem name='Bank Account number' value={bankAccountNumber} />
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

const EditableInfoListItem = ({name, value}: {name: string, value: string}) => {
    const [editing, setIsEditing] = useState(false);
    const [oldValue, setOldValue] = useState(value);
    const [innerValue, setInnerValue] = useState(value);
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
                                    if(isInteger(newValue)){
                                        setInnerValue(newValue);
                                    }
                                }}
                                style={{marginRight: getDimen('padding-xs')}} 
                                />
                            <Button
                                size='small' color='primary' variant='outlined'
                                onClick={() => {
                                    setOldValue(innerValue);
                                    // Call function to save on the backend
                                }}>Save</Button>
                            <Button
                                size='small' color='error' variant='outlined'
                                onClick={() => {
                                    setIsEditing(false);
                                    setInnerValue(oldValue);
                                }}>Cancel</Button>
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