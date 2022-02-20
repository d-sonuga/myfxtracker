import BaseButton from './base-button'
import {ButtonPropTypes} from './types'

const PlainButton = ({children, onClick, className, style, disabled, elevation, type, ...props}: ButtonPropTypes) => {
    return(
    <BaseButton
        variant='text'
        onClick={onClick}
        className={className}
        disabled={disabled}
        elevation={elevation}
        type={type}
        style={style}
        {...props}>{children}</BaseButton>
    );
}

export default PlainButton