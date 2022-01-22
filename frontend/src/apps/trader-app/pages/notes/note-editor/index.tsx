import {ReactNode, useEffect, useState} from 'react'
import {Editable} from 'slate-react'
import {Plate, ELEMENT_PARAGRAPH, ELEMENT_H1, usePlateStore, ELEMENT_H2, usePlateEditorRef} from '@udecode/plate'
import {Dialog} from '@mui/material'
import Toolbar from './toolbar'
import plugins from './plugins'
import { getDimen } from '@conf/utils'
import { H5 } from '@components/text'
import { Input } from '@components/inputs'
import TitleInput from './title-input'
import { Editor, Transforms } from 'slate'


const NoteEditor = ({note, setTitle, setContent}: {note: any, setTitle: Function, setContent: Function}) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);
    const openDialog = (el: ReactNode) => {
        setDialogContent(el);
        setDialogIsOpen(true);
    }
    //console.log(content[0].children[0].text);
    return(
        <div style={{paddingTop: getDimen('padding-md')}}>
            <Dialog onClose={() => setDialogIsOpen(false)} open={dialogIsOpen}>
                {dialogContent}
            </Dialog>
            <TitleInput title={note.title} setTitle={setTitle} />
            <Toolbar openDialog={openDialog} closeDialog={() => setDialogIsOpen(false)} />
            <Plate
                plugins={plugins}
                onChange={(newValue) => {
                    //console.log(editor);
                    setContent(newValue);
                }}
                editableProps={{
                    placeholder: 'Notes...'
                }} />
        </div>
    );
}

export default NoteEditor