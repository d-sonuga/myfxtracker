import {useState} from 'react'
import {PlateEditor} from '@udecode/plate-core'
import {ColumnBox} from '@components/containers'
import {H6} from '@components/text'
import {getDimen} from '@conf/utils'
import NoOfColumnsInput from './no-of-columns-input'
import NoOfRowsInput from './no-of-rows-input'
import Buttons from './buttons'
import createTableNode from './create-table-node'
import {ELEMENT_PARAGRAPH} from '@udecode/plate-paragraph'
import {Transforms} from 'slate'


const InsertTableDialogContent = ({closeDialog, editor}: {closeDialog: Function, editor: PlateEditor}) => {
    const [rows, setRows] = useState(1);
    const [columns, setColumns] = useState(2);
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
        closeDialog();
    }
    return(
        <div onKeyPress={(e: any) => {
            if(e.key === 'Enter'){
                onOkClick();
            }
        }}>
            <ColumnBox
                style={{
                    margin: getDimen('padding-md')
                }}>
                <H6 style={{textAlign: 'center'}}>Insert Table</H6>
                <NoOfRowsInput
                    rows={rows}
                    setRows={(newValue: string) => setNewValueIfValidNumber(newValue, setRows)}
                    />
                <NoOfColumnsInput
                    columns={columns}
                    setColumns={(newValue: string) => setNewValueIfValidNumber(newValue, setColumns)}
                    />
                <Buttons
                    onOkClick={() => onOkClick()}
                    closeDialog={closeDialog} />
            </ColumnBox>
        </div>
    )
}

export default InsertTableDialogContent