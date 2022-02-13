import {PlateEditor} from '@udecode/plate'
import ListButtons from './list-buttons'
import InsertTableButton from './insert-table-button'
import InsertImageButton from './insert-image-button'
import InsertLinkButton from './insert-link-button'


const InsertContentButtons = ({editor}: {editor: PlateEditor}) => {
    return(
        <>
            <ListButtons editor={editor} />
            <InsertTableButton editor={editor} />
            <InsertLinkButton editor={editor} />
            <InsertImageButton editor={editor} />
        </>
    )
}

export default InsertContentButtons