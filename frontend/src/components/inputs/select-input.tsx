import {useState} from 'react'
import {TextField, MenuItem} from '@mui/material'
import {SelectInputPropTypes} from './types'


const SelectInput = ({placeholder, type, helperText, style, options, onChange, value, ...props}: SelectInputPropTypes) => {
    const [fieldValue, setFieldValue] = useState(value);
    // If value was changed directly by the client component
    if(value !== fieldValue){
        setFieldValue(value);
    }
    return(
        <TextField
            select
            label={placeholder ? placeholder : ''}
            variant='filled'
            helperText={helperText ? helperText : ''}
            sx={style}
            value={fieldValue}
            onChange={(e) => {
                setFieldValue(e.target.value);
                onChange(e);
            }}
            {...props}>
            {options.map((option: string) => (
            <MenuItem key={option} value={option}>
                {option}
            </MenuItem>
        ))}
        </TextField>
    );
}

export default SelectInput