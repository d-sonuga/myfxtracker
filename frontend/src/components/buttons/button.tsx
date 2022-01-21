import BaseButton from './base-button'
import {ButtonPropTypes} from './types'

const Button = ({children, onClick, className, style, disabled, elevation, type}: ButtonPropTypes) => {
    return(
    <BaseButton
        variant='contained'
        onClick={onClick}
        className={className}
        disabled={disabled}
        elevation={elevation}
        type={type}
        style={style}>{children}</BaseButton>
    );
}

export default Button