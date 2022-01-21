import {useField, FieldHookConfig} from 'formik'
import {SelectInput as BaseSelectInput} from '@components/inputs'
import {getDimen} from '@conf/utils'

/**
 * A component to be used as select inputs in a formik form
 */

const SelectInput = (props: FieldHookConfig<string> & {options: string[]}) => {
    const [field, meta, helpers] = useField(props);

    return(
        <BaseSelectInput
            placeholder={props.placeholder}
            value={meta.initialValue ? meta.initialValue : ''}
            error={meta.error && meta.touched ? true : false}
            helperText={meta.error && meta.touched ? meta.error : ''}
            onChange={(e) => {
                helpers.setTouched(true);
                helpers.setValue(e.target.value);
            }}
            style={{width: '100%', marginBottom: getDimen('padding-xs')}}
            options={props.options} />
    );
}

export default SelectInput