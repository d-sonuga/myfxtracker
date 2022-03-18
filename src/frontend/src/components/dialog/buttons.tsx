import {RowBox} from '@components/containers'
import {Button} from '@components/buttons'
import {getDimen} from '@conf/utils'
import {DialogButtonsPropTypes} from './types'


const Buttons = ({onOkClick, onCancelClick, okButtonColor, okButtonContent, okButtonProps, showCancelButton}: DialogButtonsPropTypes) => {
    return(
        <RowBox style={{
            justifyContent: 'right',
            marginTop: getDimen('padding-xs')
            }}>
            {showCancelButton !== undefined && !showCancelButton?
                null
                : <Button
                    style={{
                        marginRight: getDimen('padding-xs')
                    }}
                    onClick={() => onCancelClick()}
                    color='neutral'>Cancel</Button>
            }
            <Button
                color={okButtonColor}
                onClick={(e) => onOkClick()}
                {...okButtonProps}>
                {okButtonContent ? 
                    typeof(okButtonContent) === 'string' ? 'ok' : okButtonContent
                    : 'ok'
                }
            </Button>
        </RowBox>
    )
}

export default Buttons