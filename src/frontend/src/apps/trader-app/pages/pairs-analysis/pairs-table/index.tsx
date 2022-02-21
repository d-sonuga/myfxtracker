import {Table} from '@apps/trader-app/components'
import {HeaderItemObject} from '@apps/trader-app/components/table/types'
import { getColor } from '@conf/utils'
import createRows from './create-rows'
import {PairsTablePropTypes} from './types'


const PairsTable = ({calc}: PairsTablePropTypes) => {
    const rows = createRows(calc);
    return(
        <Table
            headers={[
                [
                    headerObj('Pair', 2), headerObj('Positions', 2),
                    headerObj('Trades (%)', 2), headerObj('Triggered Positions (%)', 2)],
                ['', 'Total', 'Profitable', 'Losing', 'Short', 'Long', 'TP', 'SL']
            ]}
            rows={rows}
            headerStyle={{
                textAlign: 'center'
            }}
            headerRowTextConditionalStyle={{
                condition: (i) => i === 1,
                style: {color: getColor('dark-gray')}
            }}
            bodyColumnConditionalStyle={[
                {condition: (i) => i === 1, style: {background: getColor('light-gray')}},
                {condition: (i) => i === 2 || i === 6, style: {background: getColor('xlight-green')}},
                {condition: (i) => i === 3 || i === 7, style: {background: getColor('light-red')}}
            ]}
            data-testid='pairs-table'
            />
    );
}

const headerObj = (name: string, colSpan?: number) => {
    const obj: HeaderItemObject = {name};
    if(colSpan !== undefined){
        obj.colSpan = colSpan;
    }
    return obj
}

export default PairsTable