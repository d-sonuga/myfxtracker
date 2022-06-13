import {useContext} from 'react'
import {Divider} from '@mui/material'
import {format} from 'timeago.js'
import {Button} from '@components/buttons'
import {RowBox} from '@components/containers'
import {SBP} from '@components/text'
import {getColor, getDimen} from '@conf/utils'
import {RefreshDataContext, DataIsRefreshingContext, GlobalDataContext} from '@apps/trader-app'
import LoadingIcon from '@components/loading-icon'


const DataStatusBar = () => {
    const globalData = useContext(GlobalDataContext);
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
    return(
        <>
            <RowBox style={{
                justifyContent: 'right',
                marginTop: getDimen('padding-xs'),
                marginBottom: getDimen('padding-xs'),
                alignItems: 'center'
            }}>
                <SBP style={{
                    color: getColor('dark-gray'),
                    marginRight: getDimen('padding-xs')
                }}>Data Last Refreshed: {lastDataRefreshDisplay}</SBP>
                <Button 
                    variant='outlined'
                    size='small'
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
            <Divider />
        </>
    )
}

export default DataStatusBar