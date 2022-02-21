import {getPluginType, ELEMENT_UL, ELEMENT_OL, PlateEditor} from '@udecode/plate'
import {FormatListBulleted, FormatListNumbered} from '@mui/icons-material'
import {ListToolbarButton} from '@udecode/plate-ui-list'


const ListButtons = ({editor}: {editor: PlateEditor}) => {
    return(
        <>
            <ListToolbarButton
                type={getPluginType(editor, ELEMENT_UL)}
                icon={<FormatListBulleted />}
                tooltip={{content: 'Insert Bulleted List'}}
                />
            <ListToolbarButton
                type={getPluginType(editor, ELEMENT_OL)}
                icon={<FormatListNumbered />}
                tooltip={{content: 'Insert Numbered List'}}
                />
        </>
    )
}

export default ListButtons