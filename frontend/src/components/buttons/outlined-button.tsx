import BaseButton from './base-button'
import {OutlinedButtonPropTypes} from './types'


const OutlinedButton = ({children, onClick, className, style, disabled, elevation, type}: OutlinedButtonPropTypes) => {
    return(
        <BaseButton
            variant='outlined'
            onClick={onClick}
            className={className}
            disabled={disabled}
            elevation={elevation}
            type={type}
            style={style}>{children}</BaseButton>
    );
}

export default OutlinedButton