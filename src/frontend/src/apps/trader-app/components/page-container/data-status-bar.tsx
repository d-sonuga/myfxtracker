import {useContext} from 'react'
import {Divider} from '@mui/material'
import {Button} from '@components/buttons'
import {RowBox} from '@components/containers'
import {SBP} from '@components/text'
import {getColor, getDimen} from '@conf/utils'
import {RefreshDataContext, DataIsRefreshingContext} from '@apps/trader-app'
import LoadingIcon from '@components/loading-icon'


const DataStatusBar = () => {
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
                }}>Data Last Refreshed: 17/03/2022 at 3:00 am</SBP>
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