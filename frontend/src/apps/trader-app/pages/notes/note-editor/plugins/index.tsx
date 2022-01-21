import { getColor } from '@conf/utils';
import {createParagraphPlugin, createBlockquotePlugin, createHeadingPlugin,
    createBoldPlugin, createItalicPlugin, createUnderlinePlugin, createStrikethroughPlugin, 
    createPlugins, createPlateUI, createSubscriptPlugin, createSuperscriptPlugin,
    createListPlugin, createResetNodePlugin, createSoftBreakPlugin, createExitBreakPlugin,
    createTablePlugin, createAlignPlugin, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4,
    ELEMENT_H5, ELEMENT_H6, ELEMENT_PARAGRAPH, createPluginFactory, DOMHandler, HandlerReturnType,
    createLinkPlugin, ELEMENT_LINK, TableElement, createImagePlugin, createSelectOnBackspacePlugin,
    ELEMENT_IMAGE
} from '@udecode/plate'
import {ELEMENT_TD} from '@udecode/plate-table'
//import TableElement from './table-element'


const plugins = createPlugins([
    // elements
    createParagraphPlugin(),      // paragraph element
    createBlockquotePlugin(),     // blockquote element
    createHeadingPlugin(),        // heading elements
    createListPlugin(),           // list elements
    createResetNodePlugin(),
    createSoftBreakPlugin(),
    createExitBreakPlugin(),
    createTablePlugin(),          // tables
    // links
    createLinkPlugin(),

    // marks
    createBoldPlugin(),           // bold mark
    createItalicPlugin(),         // italic mark
    createUnderlinePlugin(),      // underline mark
    createStrikethroughPlugin(),  // strikethrough mark
    createSuperscriptPlugin(),    // superscript mark
    createSubscriptPlugin(),      // subscript mark

    // alignment
    createAlignPlugin({ 
        inject: {
        props: {
            validTypes: [
                ELEMENT_PARAGRAPH,
                ELEMENT_H1,
                ELEMENT_H2,
                ELEMENT_H3,
                ELEMENT_H4,
                ELEMENT_H5,
                ELEMENT_H6
            ],
        }
        }
    }),
    createImagePlugin(),
], {
    components: createPlateUI({
        [ELEMENT_LINK]: ({attributes, children, element}) => <a 
                {...attributes}
                style={{
                    color: getColor('light-blue'),
                    textDecoration: 'underline',
                    onMouseOver: 'pointer'
                }}
                href={element.url} target='_blank'>{children}
            </a>,
        [ELEMENT_TD]: ({attributes, children, element}) => <td
                {...attributes}
                style={{
                    border: '1px solid rgba(0,0,0,.55)'
                }}>{children}</td>
    })
});

export default plugins