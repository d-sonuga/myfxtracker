import {useState} from 'react'
import {PlateEditor} from '@udecode/plate-core'
import {ImageToolbarButton} from '@udecode/plate-ui-image'
import {Image} from '@mui/icons-material'
import {Input} from '@components/inputs'
import Dialog from '@components/dialog'


const InsertImageButton = ({editor}: {editor: PlateEditor}) => {
    const [imageUrl, setImageUrl] = useState('');
    const [resolve, setResolve] = useState<Function>(() => {});
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const closeDialog = () => {
        setImageUrl('');
        setResolve(() => {});
        setDialogIsOpen(false);
    }
    return(
        <>
        {dialogIsOpen ?
            <Dialog
                title='Insert Image'
                onClose={() => closeDialog()}
                open={dialogIsOpen}
                onOkClick={() => resolve(imageUrl)}
                onCancelClick={() => closeDialog()}>
                <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder='Image url'
                />
            </Dialog>
            : null
        }
        <ImageToolbarButton
            icon={<Image />}
            getImageUrl={() => {
                return new Promise((resolve) => {
                    setResolve(prevResolve => (url: string) => resolve(url));
                })
            }}
            tooltip={{content: 'Insert Image'}} />
        </>
    )
}

export default InsertImageButton