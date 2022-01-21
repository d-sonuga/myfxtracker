import {PlateEditor} from '@udecode/plate-core'
import {ToolbarButton} from '@udecode/plate-ui'
import {EuroSymbol} from '@mui/icons-material'


const CurrencyToolbarButton = ({editor}: {editor: PlateEditor}) => {
    return(
        <>
        <ToolbarButton
            icon={<EuroSymbol />}
            tooltip={{content: 'Insert Symbol'}}
            />
        </>
    )
}

export default CurrencyToolbarButton