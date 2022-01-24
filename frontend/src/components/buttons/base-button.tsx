import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import {BaseButtonPropTypes} from './types'

const BaseButton = ({variant, children, onClick, className, style, disabled, elevation, ...props}: BaseButtonPropTypes) => {
    return(
        <Button
            variant={variant}
            className={className}
            onClick={onClick}
            disabled={disabled}
            disableElevation={elevation === undefined ? true : !elevation}
            sx={{
                ...style
            }}
            {...props}>{children}</Button>
    );
}

export default BaseButton
