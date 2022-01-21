import {getPluginType, PlateEditor} from '@udecode/plate'
import {ToolbarButton} from '@udecode/plate-ui-toolbar'
import {LinkToolbarButton} from '@udecode/plate-ui-link'
import {ImageToolbarButton} from '@udecode/plate-ui-image'
import {TableView, Link, Image} from '@mui/icons-material'
import ListButtons from './list-buttons'
//import CurrencyToolbarButton from './currency-toolbar-button'
import InsertTableDialogContent from './insert-table-dialog-content'


const InsertContentButtons = ({editor, openDialog, closeDialog}:
    {editor: PlateEditor, openDialog: Function, closeDialog: Function}) => {
    return(
        <>
            <ListButtons editor={editor} />
            <ToolbarButton
                type={getPluginType(editor, 'table')}
                icon={<TableView />}
                tooltip={{content: 'Insert Table'}}
                onMouseDown={() => {
                    openDialog(<InsertTableDialogContent closeDialog={closeDialog} editor={editor} />)
                }}
                />
            <LinkToolbarButton
                icon={<Link />}
                tooltip={{content: 'Insert Link'}}
                />
            <ImageToolbarButton
                icon={<Image />}
                tooltip={{content: 'Insert Image'}} />
        </>
    )
}

export default InsertContentButtons