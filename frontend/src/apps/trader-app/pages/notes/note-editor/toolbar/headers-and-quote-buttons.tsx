import {getPluginType, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, PlateEditor,
    ELEMENT_H4, ELEMENT_H5, ELEMENT_H6, ELEMENT_BLOCKQUOTE} from '@udecode/plate'
import {BlockToolbarButton} from '@udecode/plate-ui'
import {LooksOne, LooksTwo, Looks3, Looks4, Looks5, Looks6, FormatQuote} from '@mui/icons-material'


const HeadersAndQuoteButtons = ({editor}: {editor: PlateEditor}) => {
    return(
        <>
            <BlockToolbarButton
                type={getPluginType(editor, ELEMENT_H1)}
                icon={<LooksOne />}
                tooltip={{content: 'Header 1'}}
            />
            <BlockToolbarButton
                type={getPluginType(editor, ELEMENT_H2)}
                icon={<LooksTwo />}
                tooltip={{content: 'Header 2'}}
            />
            <BlockToolbarButton
                type={getPluginType(editor, ELEMENT_H3)}
                icon={<Looks3 />}
                tooltip={{content: 'Header 3'}}
            />
            <BlockToolbarButton
                type={getPluginType(editor, ELEMENT_H4)}
                icon={<Looks4 />}
                tooltip={{content: 'Header 4'}}
            />
            <BlockToolbarButton
                type={getPluginType(editor, ELEMENT_H5)}
                icon={<Looks5 />}
                tooltip={{content: 'Header 5'}}
            />
            <BlockToolbarButton
                type={getPluginType(editor, ELEMENT_H6)}
                icon={<Looks6 />}
                tooltip={{content: 'Header 6'}}
            />
            <BlockToolbarButton
                type={getPluginType(editor, ELEMENT_BLOCKQUOTE)}
                icon={<FormatQuote />}
                tooltip={{content: 'Insert Blockquote'}}
            />
        </>
    )
}

export default HeadersAndQuoteButtons