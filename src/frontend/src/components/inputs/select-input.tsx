import {useState} from 'react'
import {TextField, MenuItem} from '@mui/material'
import {SelectInputPropTypes} from './types'


const SelectInput = ({placeholder, type, helperText, style, options, onChange, value,
        'data-testid': testId, ...props}: SelectInputPropTypes) => {
    const [fieldValue, setFieldValue] = useState(value);
    
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
            data-testid={testId}
            {...props}>
            {options.map((option: string) => (
            <MenuItem key={option} value={option} data-testid={option}>
                {option}
            </MenuItem>
            ))}
        </TextField>
    );
}

export default SelectInput