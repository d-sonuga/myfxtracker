import {ChangeEventHandler, MutableRefObject} from 'react'
import {ComponentPropTypes} from '@components/types'
import { TextFieldProps } from '@mui/material'


type InputPropTypes = ComponentPropTypes & TextFieldProps & {
    /**
     * The input's placeholder, value to be used when
     * no value has been inputted
     */
    placeholder?: string,
    /**     
     * Input type
     */
    type?: string,
    /** The value to be rendered in the input */
    value: string | number,
    /** Is the value in the input erroneous 
     * (according to some standard defined by the client component) 
     * */
    error?: boolean,
    /** Description of the input for the user */
    helperText?: string,
    /** Variant for the underlying MUI component */
    variant?: 'filled' | 'standard' | 'outlined',
    /** What should happen when the value in the input changes */
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    /** React ref for base input element */
    inputRef?: MutableRefObject<HTMLElement | null>,
    autoFocus?: boolean,
    'data-testid'?: string
}

type SelectInputPropTypes = InputPropTypes & {
    /** Options for the select input */
    options: string[]
}

type ChipSelectInputPropTypes = {
    options: string[],
    onChange?: Function,
    defaultOption?: 'first' | 'last' | number
}

type FileInputPropTypes = {
    name: string,
    onChange: Function,
    accept?: string,
    placeholder?: string
}

export type {
    InputPropTypes,
    SelectInputPropTypes,
    ChipSelectInputPropTypes,
    FileInputPropTypes
}