import {TextField} from '@mui/material'
import {InputPropTypes} from './types'


const Input = ({placeholder, type, helperText, style, variant, ...props}: InputPropTypes) => {
    return(
        <TextField
            label={placeholder ? placeholder : ''}
            type={type ? type : 'text'}
            variant={variant ? variant : 'filled'}
            helperText={helperText ? helperText : ''}
            sx={style}
            {...props} />
    );
}

export default Input