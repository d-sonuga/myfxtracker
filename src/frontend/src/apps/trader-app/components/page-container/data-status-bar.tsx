import {useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import {Grid, createTheme, ThemeProvider} from '@mui/material'
import {Divider} from '@mui/material'
import {format} from 'timeago.js'
import {Button} from '@components/buttons'
import {RowBox} from '@components/containers'
import {P, SBP} from '@components/text'
import {RouteConst} from '@conf/const'
import {getColor, getDimen} from '@conf/utils'
import {RefreshDataContext, DataIsRefreshingContext, GlobalDataContext, PermissionsContext} from '@apps/trader-app'
import LoadingIcon from '@components/loading-icon'

/*
const DataStatusBar = () => {
    const globalData = useContext(GlobalDataContext);
    const permissions = useContext(PermissionsContext);
    const dataIsRefreshing = useContext(DataIsRefreshingContext);
    const refreshData = useContext(RefreshDataContext);
    const dataHasRefreshedBefore = () => {
        // If the data has never been refreshed, the last refreshed time 
        // will be set to an impossibly long time ago, about 100 years
        const currentYear = (new Date()).getFullYear();
        const lastDataRefreshTimeYear = globalData.lastDataRefreshTime().getFullYear();
        return currentYear - lastDataRefreshTimeYear < 1;
    }
    const lastDataRefreshDisplay = dataHasRefreshedBefore() ?
        format(globalData.lastDataRefreshTime())
        : 'Never'
    const subscriptionStatusTextStyle = {fontWeight: 'bold', marginRight: getDimen('padding-xs')};
    return(
        <>
            <RowBox style={{
                justifyContent: 'space-between',
                marginTop: getDimen('padding-xs'),
                marginBottom: getDimen('padding-xs'),
                alignItems: 'center'
            }}>
                {(() => {
                    if(!permissions.canRefreshAccount){
                        let text = <P style={subscriptionStatusTextStyle}>Your subscription has expired</P>;
                        if(!globalData.userHasPaid()){
                            text = <P style={subscriptionStatusTextStyle}>Your free trial is over</P>;
                        }
                        return(
                            <RowBox style={{alignItems: 'center'}}>
                                {text}
                                <Button size='small'>Subscribe Now</Button>
                            </RowBox>
                        )
                    }
                    return null;
                })()}
                <RowBox style={{alignItems: 'center'}}>
                    <SBP style={{
                        color: getColor('dark-gray'),
                        marginRight: getDimen('padding-xs')
                    }}>Data Last Refreshed: {lastDataRefreshDisplay}</SBP>
                    <Button 
                        variant='outlined'
                        size='small'
                        disabled={!permissions.canRefreshAccount}
                        onClick={() => {
                            if(!dataIsRefreshing){
                                refreshData();
                            }
                        }}>{
                            dataIsRefreshing ? 
                                <LoadingIcon color={getColor('gray')} size={20} />
                                : 'Refresh Data'
                        }</Button>
                </RowBox>
            </RowBox>
            <Divider />
        </>
    )
}
*/

const DataStatusBar = () => {
    const globalData = useContext(GlobalDataContext);
    const permissions = useContext(PermissionsContext);
    const dataIsRefreshing = useContext(DataIsRefreshingContext);
    const refreshData = useContext(RefreshDataContext);
    const navigate = useNavigate();
    const dataHasRefreshedBefore = () => {
        // If the data has never been refreshed, the last refreshed time 
        // will be set to an impossibly long time ago, about 100 years
        const currentYear = (new Date()).getFullYear();
        const lastDataRefreshTimeYear = globalData.lastDataRefreshTime().getFullYear();
        return currentYear - lastDataRefreshTimeYear < 1;
    }
    const lastDataRefreshDisplay = dataHasRefreshedBefore() ?
        format(globalData.lastDataRefreshTime())
        : 'Never'
    const subscriptionStatusTextStyle = {fontWeight: 'bold', marginRight: getDimen('padding-xs')};
    const {TRADER_APP_ROUTE, TRADER_SUBSCRIBE_NOW_ROUTE} = RouteConst;
    return(
        <ThemeProvider theme={themeWithSpecificBrkpoints}>
            <Grid container sx={{
                paddingTop: getDimen('padding-xs'),
                paddingBottom: getDimen('padding-xs'),
                justifyContent: 'space-between'
            }}>
                <Grid item>
                    {(() => {
                        if(!permissions.canRefreshAccount){
                            let text = <P style={subscriptionStatusTextStyle}>Your subscription has expired</P>;
                            if(!globalData.userHasPaid()){
                                text = <P style={subscriptionStatusTextStyle}>Your free trial is over</P>;
                            }
                            return(
                                <RowBox style={{alignItems: 'center'}}>
                                    {text}
                                    <Button 
                                        size='small'
                                        style={{marginRight: getDimen('padding-xs')}}
                                        onClick={() => {
                                            navigate(`/${TRADER_APP_ROUTE}/${TRADER_SUBSCRIBE_NOW_ROUTE}`)
                                        }}>
                                            Subscribe Now
                                    </Button>
                                </RowBox>
                            )
                        }
                        return null;
                    })()}
                </Grid>
                <Grid item sx={{
                    paddingTop: {
                        xs: getDimen('padding-xs'),
                        sm: 0
                    }
                }}>
                    <RowBox style={{alignItems: 'center'}}>
                        <SBP style={{
                            color: getColor('dark-gray'),
                            marginRight: getDimen('padding-xs')
                        }}>Data Last Refreshed: {lastDataRefreshDisplay}</SBP>
                        <Button 
                            variant='outlined'
                            size='small'
                            disabled={!permissions.canRefreshAccount}
                            onClick={() => {
                                if(!dataIsRefreshing){
                                    refreshData();
                                }
                            }}>{
                                dataIsRefreshing ? 
                                    <LoadingIcon color={getColor('gray')} size={20} />
                                    : 'Refresh Data'
                            }</Button>
                    </RowBox>
                </Grid>
            </Grid>
            <Divider />
        </ThemeProvider>
    )
}


const themeWithSpecificBrkpoints = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 706,
            md: 900,
            lg: 1200,
            xl: 1536,
        }
    }
})

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    mobile: false;
    tablet: false;
    laptop: false;
    desktop: false;
  }
}



export default DataStatusBar