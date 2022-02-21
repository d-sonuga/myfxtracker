import {ToolbarButton} from '@udecode/plate-ui'
import {Undo, Redo} from '@mui/icons-material'
import {PlateEditor} from '@udecode/plate-core'


const UndoRedoButtons = ({editor}: {editor: PlateEditor}) => {
    const noMoreRedos = (editor: PlateEditor) => editor && editor.history.redos.length === 0;
    const noMoreUndos = (editor: PlateEditor) => editor && editor.history.undos.length === 0;
    
    return(
        <>
            <ToolbarButton
                icon={<Undo sx={{opacity: noMoreUndos(editor) ? 0.5 : undefined}} />}
                onMouseDown={() => {
                    if(!noMoreUndos(editor)){
                        editor.undo();
                    }
                }}
                tooltip={{content: 'Undo (ctrl + z)'}}
                />
            <ToolbarButton 
                icon={<Redo sx={{opacity: noMoreRedos(editor) ? 0.5 : undefined}} />}
                onMouseDown={() => {
                    if(!noMoreRedos(editor)){
                        editor.redo();
                    }
                }}
                tooltip={{content: 'Redo (ctrl + y)'}}
                />
        </>
    )
}

export default UndoRedoButtons