import {ReactNode} from 'react'


type TablePropTypes = {
    /**
     * Note: general styles, like headerStyle, bodyStyle have less precedence over
     * conditional styles and conditional column styles have precedence over
     * conditional row styles
     */
    title?: string,
    headers?: HeaderItem[] | Array<HeaderItem[]>,
    rows: Array<Array<ReactNode>>,
    /** styles to apply to all rows and columns */
    style?: InlineCssStyle,
    /** Styles to apply only to rows in the header */
    headerStyle?: InlineCssStyle,
    /** Styles to apply only to rows in the body */
    bodyStyle?: InlineCssStyle,
    /** 
     * styles to apply to rows in the body if the condition is true
     * i is the 0-based index of the row
     * */
    bodyRowConditionalStyle?: ConditionalStyle | Array<ConditionalStyle>,
    /**
     * styles to apply to rows in the header if the condition is true
     * i is the 0-based index of the row
     * */
    headerRowConditionalStyle?: ConditionalStyle | Array<ConditionalStyle>,
    /**
     * styles to apply to cells in the header if the condition is true
     * i is the 0-based index of the row
     * */
    headerColumnConditionalStyle?: ConditionalStyle | Array<ConditionalStyle>,
    /**
     * styles to apply to cells in the body if the condition is true
     * i is the 0-based index of the row
     * */
    bodyColumnConditionalStyle?: ConditionalStyle | Array<ConditionalStyle>,

    /** Styles to apply only to text in the header */
    headerTextStyle?: InlineCssStyle,
    /** Styles to apply only to text in the body */
    bodyTextStyle?: InlineCssStyle,
    /** 
     * styles to apply to row text in the body if the condition is true
     * i is the 0-based index of the row
     * */
    bodyRowTextConditionalStyle?: ConditionalStyle | Array<ConditionalStyle>,
    /**
     * styles to apply to row text in the header if the condition is true
     * i is the 0-based index of the row
     * */
    headerRowTextConditionalStyle?: ConditionalStyle | Array<ConditionalStyle>,
    /**
     * styles to apply to cells text in the header if the condition is true
     * i is the 0-based index of the column
     * */
    headerColumnTextConditionalStyle?: ConditionalStyle | Array<ConditionalStyle>,
    /**
     * styles to apply to cells text in the body if the condition is true
     * i is the 0-based index of the column
     * */
    bodyColumnTextConditionalStyle?: ConditionalStyle | Array<ConditionalStyle>,
    'data-testid'?: string
}

type InlineCssStyle = {[key: string]: any}

/**
 * Inline style, along with a function, which when passed
 * the column or row index of which part of the table is currently
 * being iterated over, returns a boolean that says whether or not
 * the style should be applied
 */
type ConditionalStyle = {
    condition: {(i: number): boolean},
    style: InlineCssStyle
}

/**
 * A string to be displayed as the header,
 * or an object with name as the word to be displayed
 * as the header, along with extra data to use in formatting
 * of the header
 */
type HeaderItem = string | HeaderItemObject;

/** A header item with no possibility of being just a string */
type HeaderItemObject = {
    name: string,
    colSpan?: number
}

export type {
    TablePropTypes,
    ConditionalStyle,
    HeaderItem,
    HeaderItemObject
}