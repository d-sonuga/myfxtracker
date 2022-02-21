import {usePlateEditorState} from '@udecode/plate'
import {HeadingToolbar} from '@udecode/plate-ui-toolbar'
import TextFormatButtons from './text-format-buttons'
import AlignContentButtons from './align-content-buttons'
import UndoRedoButtons from './undo-redo-buttons'
import InsertContentButtons from './insert-content-buttons'
import HeadersAndQuoteButtons from './headers-and-quote-buttons'


const Toolbar = () => {
    const editor = usePlateEditorState();
    return(
        <HeadingToolbar>
            <HeadersAndQuoteButtons editor={editor} />
            <TextFormatButtons editor={editor} />
            <UndoRedoButtons editor={editor} />
            <AlignContentButtons editor={editor} />
            <InsertContentButtons editor={editor} />
        </HeadingToolbar>
    )
}

export default Toolbar