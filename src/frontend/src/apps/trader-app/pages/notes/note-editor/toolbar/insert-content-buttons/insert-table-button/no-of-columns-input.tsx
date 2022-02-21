import {RowBox} from '@components/containers'
import {Input} from '@components/inputs'
import {P} from '@components/text'
import {getDimen} from '@conf/utils'


const NoOfColumnsInput = ({columns, setColumns}: {columns: number, setColumns: Function}) => {
    return(
        <RowBox
            style={{
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: getDimen('padding-xs')
            }}>
            <P>Number of cols: &nbsp;</P>
            <Input
                variant='standard'
                type='number'
                value={columns}
                onChange={(e: any) => setColumns(e.target.value)} />
        </RowBox>
    )
}

export default NoOfColumnsInput