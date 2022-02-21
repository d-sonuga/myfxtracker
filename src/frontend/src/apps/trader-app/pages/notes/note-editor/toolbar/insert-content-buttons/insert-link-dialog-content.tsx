import {useState} from 'react'
import {Input} from '@components/inputs'


const InsertLinkDialogContent = ({onOkClick, onCancelClick}: {onOkClick: Function, onCancelClick: Function}) => {
    const [url, setUrl] = useState('');
    return(
        <>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder='the url' />  
        </>
    )
}

export default InsertLinkDialogContent