import {getPluginType, MARK_BOLD, MARK_UNDERLINE, MARK_STRIKETHROUGH, MARK_ITALIC,
    MARK_SUBSCRIPT, MARK_SUPERSCRIPT, PlateEditor} from '@udecode/plate'
import {MarkToolbarButton} from '@udecode/plate-ui-toolbar'
import {FormatBold, FormatItalic, FormatStrikethrough, FormatUnderlined, 
    Subscript, Superscript} from '@mui/icons-material'
import 'tippy.js/dist/tippy.css'


const TextFormatButtons = ({editor}: {editor: PlateEditor}) => {
    return(
        <>
            <MarkToolbarButton
                id='apps-trader-app-pages-notes-toolbar-text-format-buttons-bold'
                type={getPluginType(editor, MARK_BOLD)}
                icon={<FormatBold />}
                tooltip={{content: 'Bold (ctrl + b)'}}
                />
            <MarkToolbarButton
                type={getPluginType(editor, MARK_ITALIC)}
                icon={<FormatItalic />}
                onMouseDown={() => editor.addMark(MARK_ITALIC, true)}
                tooltip={{content: 'Italic (ctrl + i)'}}
                />
            <MarkToolbarButton
                type={getPluginType(editor, MARK_UNDERLINE)}
                icon={<FormatUnderlined />}
                tooltip={{content: 'Underline (ctrl + u)'}}
                />
            <MarkToolbarButton
                type={getPluginType(editor, MARK_STRIKETHROUGH)}
                icon={<FormatStrikethrough />}
                tooltip={{content: 'Strikethrough (ctrl + shift + x)'}}
                />
            <MarkToolbarButton
                type={getPluginType(editor, MARK_SUPERSCRIPT)}
                clear={getPluginType(editor, MARK_SUPERSCRIPT)}
                icon={<Superscript />}
                tooltip={{content: 'Superscript (ctrl + .)'}}
                />
            <MarkToolbarButton
                type={getPluginType(editor, MARK_SUBSCRIPT)}
                clear={getPluginType(editor, MARK_SUBSCRIPT)}
                icon={<Subscript />}
                tooltip={{content: 'Subscript (ctrl + ,)'}}
                />
        </>
    )
}

export default TextFormatButtons