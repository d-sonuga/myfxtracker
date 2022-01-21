import {RowBox} from '@components/containers'
import {Input} from '@components/inputs'
import {P} from '@components/text'
import {getDimen} from '@conf/utils'


const NoOfRowsInput = ({rows, setRows}: {rows: number, setRows: Function}) => {
    
    return(
        <RowBox
            style={{
                marginBottom: getDimen('padding-xs'),
                justifyContent: 'space-between',
                alignItems: 'baseline'
            }}>
            <P>Number of rows: &nbsp;</P>
            <Input
                variant='standard'
                type='number'
                value={rows}
                onChange={(e) => setRows(e.target.value)} />
        </RowBox>
    )
}

export default NoOfRowsInput