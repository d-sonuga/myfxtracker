import {ReactNode, useEffect, useState} from 'react'
import {Editable} from 'slate-react'
import {Plate, ELEMENT_PARAGRAPH, ELEMENT_H1, usePlateStore, ELEMENT_H2, usePlateEditorRef} from '@udecode/plate'
import Dialog from '@components/dialog'
import Toolbar from './toolbar'
import plugins from './plugins'
import { getDimen } from '@conf/utils'
import { H5 } from '@components/text'
import { Input } from '@components/inputs'
import TitleInput from './title-input'
import { Editor, Transforms } from 'slate'
import InsertLinkDialogContent from './toolbar/insert-content-buttons/insert-link-dialog-content'


const NoteEditor = ({note, setTitle, setContent}: {note: any, setTitle: Function, setContent: Function}) => {
    return(
        <div style={{paddingTop: getDimen('padding-md')}}>
            <TitleInput title={note.title} setTitle={setTitle} />
            <Toolbar />
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