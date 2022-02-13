import {useState} from 'react'
import {PlateEditor} from '@udecode/plate-core'
import {LinkToolbarButton} from '@udecode/plate-ui-link'
import {Link} from '@mui/icons-material'
import {Input} from '@components/inputs'
import Dialog from '@components/dialog'


const InsertLinkButton = ({editor}: {editor: PlateEditor}) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [resolve, setResolve] = useState<Function>(() => {});
    const [url, setUrl] = useState('');
    const closeDialog = () => {
        setUrl('');
        setDialogIsOpen(false);
        setResolve(() => {});
    }
    return(
        <>
        {dialogIsOpen ?
            <Dialog
                title='Insert Link'
                open={dialogIsOpen}
                onOkClick={() => {
                    if(url.length === 0){
                        resolve(null);
                    } else {
                        resolve(url);
                    }
                    closeDialog();
                }}
                onCancelClick={() => closeDialog()}
                onClose={() => closeDialog()}>
                    <Input
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value)
                        }}
                        placeholder='the url'
                        />
            </Dialog>
            : null
        }
        <LinkToolbarButton
            icon={<Link />}
            getLinkUrl={() => {
                return new Promise((resolve) => {
                    setDialogIsOpen(true);
                    setResolve(prevFunc => (url: string | null) => resolve(url));
                })
            }}
            tooltip={{content: 'Insert Link'}}
            />
        </>
    )
}

export default InsertLinkButton