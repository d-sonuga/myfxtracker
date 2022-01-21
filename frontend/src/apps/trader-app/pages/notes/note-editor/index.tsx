import {ReactNode, useState} from 'react'
import {Plate, ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, usePlateEditorRef} from '@udecode/plate'
import {Dialog} from '@mui/material'
import Toolbar from './toolbar'
import plugins from './plugins'


const NoteEditor = () => {
    const initialValue: any[] = [
        {type: 'p', children: [{text: ''}]}
    ];
    const editor = usePlateEditorRef();
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);
    const openDialog = (el: ReactNode) => {
        setDialogContent(el);
        setDialogIsOpen(true);
    }
    return(
        <>
            <Dialog onClose={() => setDialogIsOpen(false)} open={dialogIsOpen}>
                {dialogContent}
            </Dialog>
            <Toolbar openDialog={openDialog} closeDialog={() => setDialogIsOpen(false)} />
            <Plate 
                initialValue={initialValue}
                plugins={plugins}
                onChange={(newValue) => {
                    console.log(editor);
                }}
                editableProps={{
                    placeholder: 'Notes...',
                }}/>
        </>
    );
}

export default NoteEditor