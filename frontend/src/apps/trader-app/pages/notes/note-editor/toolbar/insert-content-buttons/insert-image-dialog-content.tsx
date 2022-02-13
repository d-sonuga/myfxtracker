import {useState} from 'react'
import {Input} from '@components/inputs'
import DialogBox from '@components/dialog'

const InsertImageDialogContent = ({onOkClick, onCancelClick}: {onOkClick: Function, onCancelClick: Function}) => {
    const [imageUrl, setImageUrl] = useState('');
    return(
        <>
        {/*
        <DialogBox
            title='Insert Image'
            onOkClick={() => onOkClick(imageUrl)}
            onCancelClick={onCancelClick}>
                */}
                <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder='Image url'
                    />
        {/*</DialogBox>*/}
        </>
    )
}

export default InsertImageDialogContent