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
                }}>Data Last Refreshed: {format(globalData.lastDataRefreshTime())}</SBP>
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