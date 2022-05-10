import {Button} from '@components/buttons'
import {useRef} from 'react'
import {FileInputPropTypes} from './types'


const FileInput = ({name, onChange, accept, placeholder}: FileInputPropTypes) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    return(
        <>
            <input 
                name={name}
                type='file'
                onChange={(e) => onChange(e)}
                accept={accept}
                ref={inputRef}
                style={{display: 'none'}}
                />
            <Button
                variant='outlined'
                size='medium'
                onClick={(e) => {
                    if(inputRef && inputRef.current){
                        inputRef.current.click();
                        console.log('the input:', inputRef);
                    }
                }}>{placeholder ? placeholder : name}</Button>
        </>
    )
}

export default FileInput