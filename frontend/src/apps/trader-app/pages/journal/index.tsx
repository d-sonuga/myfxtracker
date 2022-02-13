import {useContext, useEffect, useState} from 'react'
import {DataGrid, GridToolbar, GridColDef, GridRowsProp} from '@mui/x-data-grid'
import {BP} from '@components/text'
import {PageContainer} from '@apps/trader-app/components'
import {GlobalDataContext} from '@apps/trader-app'


const Journal = () => {
    const globalData = useContext(GlobalDataContext);
    const columns: GridColDef[] = [
        {field: 'id', renderHeader: () => <BP>ID</BP>, width: 90},
        {field: 'openTime', renderHeader: () => (<BP>Open Date Time</BP>), type: 'dateTime', width: 190 },
        {field: 'closeTime', renderHeader: () => (<BP>Close Date Time</BP>), type: 'dateTime', width: 190 },
        {field: 'pair', renderHeader: () => (<BP>Pair</BP>), width: 110 },
        {field: 'action', renderHeader: () => (<BP>Action</BP>), width: 80},
        {field: 'fee', renderHeader: () => (<BP>Fee</BP>), type: 'number', width: 100},
        {field: 'profit', renderHeader: () => (<BP>Profit</BP>), type: 'number', width: 120}
    ];
    const [rows, setRows] = useState<GridRowsProp>([]);
    useEffect(() => {
        if(globalData.hasLoaded()){
            setRows(globalData.getCurrentTradeAccountData().trades.map((trade, i) => {
                return {
                    id: i + 1,
                    openTime: new Date(trade.openTime).toString().split('GMT')[0],
                    closeTime: new Date(trade.closeTime).toString().split('GMT')[0],
                    pair: trade.pair, 
                    action: trade.action.toUpperCase(),
                    fee: trade.commission !== undefined && trade.swap !== undefined ? trade.commission + trade.swap : 'None Found',
                    profit: `$${trade.profitLoss}`
                }
            }));
        }
    }, [globalData])

    return(
        <PageContainer>
            <div style={{height: 300}}>
                <DataGrid
                    sx={{marginTop: '100px'}}
                    columns={columns}
                    rows={rows}
                    pageSize={10}
                    components={{
                        Toolbar: GridToolbar
                    }}
                    />
            </div>
        </PageContainer>
    )
}

export default Journal