import BaseButton from './base-button'
import {ButtonPropTypes} from './types'

const Button = ({children, onClick, className, style, disabled, elevation, type, ...props}: ButtonPropTypes) => {
    return(
    <BaseButton
        variant='contained'
        onClick={onClick}
        className={className}
        disabled={disabled}
        elevation={elevation}
        type={type}
        style={style}
        {...props}>{children}</BaseButton>
    );
}

export default Button