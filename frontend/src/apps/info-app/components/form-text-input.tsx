import {useField, FieldHookConfig} from 'formik'
import {Input} from '@components/inputs'
import {getDimen} from '@conf/utils'

/**
 * A component to be used as regular text input in a formik form
 * Uses mui's text field
 */

const TextInput = (props: FieldHookConfig<string> & {'data-testid'?: string}) => {
    const [field, meta, helpers] = useField(props);
    
    return(
        <Input
            placeholder={props.placeholder}
            type={props.type}
            value={field.value}
            error={meta.error && meta.touched ? true : false} 
            helperText={meta.touched && meta.error ? meta.error : ''}
            onChange={(e) => {
                helpers.setTouched(true);
                helpers.setValue(e.target.value);
            }}
            style={{width: '100%', marginBottom: getDimen('padding-xs')}}
            data-testid={props['data-testid']}
             />
    );
}

export default TextInput