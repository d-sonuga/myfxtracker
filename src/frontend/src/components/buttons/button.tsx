import BaseButton from './base-button'
import {ButtonPropTypes} from './types'

const Button = ({children, variant, ...props}: ButtonPropTypes) => {
    return(
    <BaseButton
        variant={variant ? variant : 'contained'}
        {...props}>{children}</BaseButton>
    );
}

export default Button