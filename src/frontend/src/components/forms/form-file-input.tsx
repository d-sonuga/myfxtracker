import {useField, FieldHookConfig} from 'formik'
import {FileInput as BaseFileInput} from '@components/inputs'
import {SP, SBP} from '@components/text';
import { getColor, getDimen } from '@conf/utils';
import { METHODS } from 'http';

/**
 * A component to be used as regular text input in a formik form
 * Uses mui's text field
 */

const FileInput = (props: FieldHookConfig<string> & {'data-testid'?: string, accept?: string}) => {
    const [field, meta, helpers] = useField(props);
    return(
        <div style={{marginBottom: getDimen('padding-xs')}}>
            <BaseFileInput
                name={props.name}
                onChange={(e: any) => {
                    helpers.setTouched(true);
                    helpers.setValue(e.target.files[0]);
                }}
                accept={props.accept}
                placeholder={props.placeholder}
                />
            <SBP style={{color: 'red', marginTop: getDimen('padding-xs')}}>{meta.error ? meta.error : ''}</SBP>
        </div>
    );
}

export default FileInput