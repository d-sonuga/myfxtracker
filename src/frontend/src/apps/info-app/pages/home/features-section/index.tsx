import Grid from '@mui/material/Grid'
import {CenterBox} from '@components/containers'
import {H4, H6} from '@components/text'
import {getDimen} from '@conf/utils'
import AutomatedJournalCard from './automated-journal-card'
import AnyBrokerCard from './any-broker-card'
import UnlimitedAccountsCard from './unlimited-accounts-card'
import featuresSectionStyle from './style'
import './style.css'

const {futureOfTradingHeaderStyle, secondHeaderStyle} = featuresSectionStyle

const FeaturesSection = () => {
    return(
        <div className='apps-info-app-home-features-section-container'>
            <CenterBox>
                <H6 style={futureOfTradingHeaderStyle}>this is the future of trading</H6>
            </CenterBox>
            <CenterBox>
                <H4 style={secondHeaderStyle}>Boost your trading performance with MyFxTracker</H4>
            </CenterBox>
            <Grid container spacing={2}
                justifyContent='center'
                alignItems='center'
                paddingX={getDimen('padding-xs')}
                sx={{
                    flexDirection: {
                        xs: 'column',
                        md: 'row'
                    }
                }}>
                <Grid item xs={12} md={3} width='400px'>
                    <AutomatedJournalCard />
                </Grid>
                <Grid item xs={12} md={3} width='400px'>
                    <AnyBrokerCard />
                </Grid>
                <Grid item xs={12} md={3} width='400px'>
                    <UnlimitedAccountsCard />
                </Grid>
            </Grid>
        </div>
    );
}

export default FeaturesSection