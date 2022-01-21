import {FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight} from '@mui/icons-material'
import {PlateEditor} from '@udecode/plate-core'
import {AlignToolbarButton} from '@udecode/plate-ui'

const AlignContentButtons = ({editor}: {editor: PlateEditor}) => {
    return(
        <>
            <AlignToolbarButton
                value='left'
                icon={<FormatAlignLeft />}
                tooltip={{content: 'Align Content Left'}}
                />
            <AlignToolbarButton
                value='center'
                icon={<FormatAlignCenter />}
                tooltip={{content: 'Align Content Center'}}
                />
            <AlignToolbarButton
                value='right'
                icon={<FormatAlignRight />}
                tooltip={{content: 'Align Content Right'}}
                />
            <AlignToolbarButton
                value='justify'
                icon={<FormatAlignJustify />}
                tooltip={{content: 'Justify Content'}}
                />
        </>
    )
}

export default AlignContentButtons