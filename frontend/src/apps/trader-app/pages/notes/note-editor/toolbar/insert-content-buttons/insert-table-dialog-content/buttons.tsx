import {RowBox} from '@components/containers'
import {Button} from '@components/buttons'
import {getColor, getDimen} from '@conf/utils'


const Buttons = ({onOkClick, closeDialog}: {onOkClick: Function, closeDialog: Function}) => {
    return(
        <RowBox style={{justifyContent: 'right'}}>
            <Button
                style={{
                    backgroundColor: getColor('dark-gray'),
                    marginRight: getDimen('padding-xs')
                }}
                onClick={() => closeDialog()}>Cancel</Button>
            <Button onClick={(e) => onOkClick()}>Ok</Button>
        </RowBox>
    )
}

export default Buttons