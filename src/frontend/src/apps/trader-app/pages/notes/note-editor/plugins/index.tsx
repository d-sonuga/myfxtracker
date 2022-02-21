import {createParagraphPlugin, createBlockquotePlugin, createHeadingPlugin,
    createBoldPlugin, createItalicPlugin, createUnderlinePlugin, createStrikethroughPlugin, 
    createPlugins, createPlateUI, createSubscriptPlugin, createSuperscriptPlugin,
    createListPlugin, createResetNodePlugin, createSoftBreakPlugin, createExitBreakPlugin,
    createTablePlugin, createAlignPlugin, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4,
    ELEMENT_H5, ELEMENT_H6, ELEMENT_PARAGRAPH, createLinkPlugin, ELEMENT_LINK, createImagePlugin, withPlaceholders
} from '@udecode/plate'
import {ELEMENT_TD} from '@udecode/plate-table'
import LinkElement from './link-element'
import TdElement from './td-element'


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
        [ELEMENT_LINK]: LinkElement,
        [ELEMENT_TD]: TdElement
    })
});

export default plugins