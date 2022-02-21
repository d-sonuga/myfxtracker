import {useState} from 'react'
import {Transforms} from 'slate'
import {getPluginType, PlateEditor} from '@udecode/plate'
import {ToolbarButton} from '@udecode/plate-ui-toolbar'
import {ELEMENT_PARAGRAPH} from '@udecode/plate-paragraph'
import {TableView} from '@mui/icons-material'
import Dialog from '@components/dialog'
import createTableNode from './create-table-node'
import NoOfRowsInput from './no-of-rows-input'
import NoOfColumnsInput from './no-of-columns-input'


const InsertTableButton = ({editor}: {editor: PlateEditor}) => {
    const [rows, setRows] = useState(1);
    const [columns, setColumns] = useState(2);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const setNewValueIfValidNumber = (newValue: string, setValue: Function) => {
        // No negative numbers or numbers greater than 10 are allowed
        const validNumber = (num: number) => !isNaN(num) && num > 0 && num < 11
        const num = parseInt(newValue);
        if(validNumber(num)){
            setValue(newValue);
        }
    }
    const onOkClick = () => {
        const tableNode = createTableNode(rows, columns);
        // Adding a paragraph to make it easy to continue editing after inserting the table
        const newParagraphNode = {type: ELEMENT_PARAGRAPH, children: [{text: ''}]};
        Transforms.insertNodes(editor, [tableNode, newParagraphNode]);
        setDialogIsOpen(false);
    }

    return(
        <>
        {dialogIsOpen ?
            <Dialog
                title='Insert Table'
                open={true}
                onClose={() => setDialogIsOpen(false)}
                onOkClick={onOkClick}
                onCancelClick={() => setDialogIsOpen(false)}>
                <NoOfRowsInput
                    rows={rows}
                    setRows={(newValue: string) => setNewValueIfValidNumber(newValue, setRows)}
                />
                <NoOfColumnsInput
                    columns={columns}
                    setColumns={(newValue: string) => setNewValueIfValidNumber(newValue, setColumns)}
                    />
            </Dialog>
            : null
        }
        <ToolbarButton
            type={getPluginType(editor, 'table')}
            icon={<TableView />}
            tooltip={{content: 'Insert Table'}}
            onMouseDown={() => {
                setDialogIsOpen(true);
            }}
            />
        </>
    )
}

export default InsertTableButton