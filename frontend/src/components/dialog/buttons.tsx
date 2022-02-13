import {RowBox} from '@components/containers'
import {Button} from '@components/buttons'
import {getColor, getDimen} from '@conf/utils'
import {DialogButtonsPropTypes} from './types'


const Buttons = ({onOkClick, onCancelClick}: DialogButtonsPropTypes) => {
    return(
        <RowBox style={{
            justifyContent: 'right',
            marginTop: getDimen('padding-xs')
            }}>
            <Button
                style={{
                    backgroundColor: getColor('dark-gray'),
                    marginRight: getDimen('padding-xs')
                }}
                onClick={() => onCancelClick()}>Cancel</Button>
            <Button onClick={(e) => onOkClick()}>Ok</Button>
        </RowBox>
    )
}

export default Buttons