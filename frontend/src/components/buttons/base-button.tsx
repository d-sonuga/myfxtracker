import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import {BaseButtonPropTypes} from './types'

const BaseButton = ({variant, children, onClick, className, style, disabled, elevation}: BaseButtonPropTypes) => {
    return(
        <Button
            variant={variant}
            className={className}
            onClick={onClick}
            disabled={disabled}
            disableElevation={elevation === undefined ? true : !elevation}
            sx={{
                ...style
            }}>{children}</Button>
    );
}

export default BaseButton
