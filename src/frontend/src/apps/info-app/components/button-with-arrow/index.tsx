import {Button} from '@components/buttons'
import {ButtonTypes} from '@components/buttons'
import ArrowIcon from '@visuals/svgs/arrow-in-circle'
import {getDimen} from '@conf/utils'


const ButtonWithArrow = ({onClick, children, style, ...others}: ButtonTypes.ButtonPropTypes) => {
    return(
        <Button onClick={onClick} style={style} {...others}>
            <span style={{marginRight: getDimen('padding-xs')}}>{children}</span>
            <ArrowIcon />
        </Button>
    );
}

export default ButtonWithArrow