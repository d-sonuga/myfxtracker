import {useContext, useEffect, useState} from 'react'
import {DataGrid, GridToolbar, GridColDef, GridRowsProp} from '@mui/x-data-grid'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import {BP} from '@components/text'
import {PageContainer} from '@apps/trader-app/components'
import {GlobalDataContext} from '@apps/trader-app'


const Journal = () => {
    const globalData = useContext(GlobalDataContext);
    const columns: GridColDef[] = [
        {field: 'id', renderHeader: () => <BP>ID</BP>, width: 90},
        {field: 'openDate', renderHeader: () => (<strong>Open Date</strong>), type: 'dateTime', width: 190 },
        {field: 'pair', renderHeader: () => (<strong>Pair</strong>), width: 110 },
        {field: 'action', renderHeader: () => (<strong>Action</strong>), width: 80},
        {field: 'lots', renderHeader: () => (<strong>Lots</strong>), type: 'number', width: 100},
        {field: 'fee', renderHeader: () => (<strong>Fee</strong>), type: 'number', width: 100},
        {field: 'profit', renderHeader: () => (<strong>Profit</strong>), type: 'number', width: 120},
        {field: 'gain', renderHeader: () => (<strong>Gain (%)</strong>), type: 'number', width: 135}
    ];
    const [rows, setRows] = useState<GridRowsProp>([]);
    useEffect(() => {
        if(globalData.hasLoaded()){
            setRows(globalData.getCurrentTradeAccountData().trades.map((trade, i) => {
                return {
                    id: i + 1,
                    openDate: trade.entry_date, 
                    pair: trade.pair, 
                    action: trade.action.toUpperCase(),
                    lots: trade.lots ? trade.lots : 'None found',
                    fee: trade.commissions ? trade.commissions : 'None found',
                    profit: `$${trade.profit_loss}`
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