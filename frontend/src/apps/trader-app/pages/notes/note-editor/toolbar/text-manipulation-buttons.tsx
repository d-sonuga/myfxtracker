import {getPluginType, PlateEditor} from '@udecode/plate'
import {MarkToolbarButton} from '@udecode/plate-ui-toolbar'
import {ContentCopy, ContentCut, ContentPaste} from '@mui/icons-material'


const TextManipulationButtons = ({editor}: {editor: PlateEditor}) => {
    return(
        <>
            <MarkToolbarButton
                type={getPluginType(editor, '')}
                icon={<ContentCopy />}
                
                />
            <MarkToolbarButton
                type={getPluginType(editor, 'cut')}
                icon={<ContentCut />}
                />
            <MarkToolbarButton
                type={getPluginType(editor, 'paste')}
                icon={<ContentPaste />}
                />
        </>
    )
}

export default TextManipulationButtons