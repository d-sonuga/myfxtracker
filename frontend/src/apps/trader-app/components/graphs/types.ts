type GraphData = Array<{[key: string]: any}>;

type BaseGraphPropTypes = {
    /**
     * The key in the data objects that hold what should be plotted on the x axis
     */
     xAxisKey: string,
     /**
     * The key in the data objects that hold what should be plotted on the y axis
     */
     yAxisKey: string,
    /** How tall should the graph be */
    height?: number,
    /** The name that will show on the tooltip when a mouse is hovering over */
    tooltipName?: string,
    data: GraphData
}

type GraphHeadingPropTypes = {
    /** Title to be displayed for graph */
    title: string,
    /** 
     * Options for the chip select component
     * In the case where different views of data may need
     * to be shown on the same graph, the user may use a 
     * selector (ChipSelect).
     * The keys of this prop are the options array passed
     * to the select component and the array of objects a key
     * corresponds to is the data that should be used for display
     * when the selector option of key has been selected
     */
    selectorOptions?: SelectorOptions,
    onSelectorSelectedOptionChange: Function,
    paddingLeft?: string | number,
    paddingTop?: string | number
}

type GraphPropTypes = Omit<BaseGraphPropTypes, 'data' | 'xAxisKey'> &
    Pick<GraphHeadingPropTypes, 'title' | 'selectorOptions'> & {
    /** 
     * Static data for use with graphs without a selector 
     * If a graph has more than one data views in one graph,
     * or has any form of selector, it should use the 
     * selectorOptions and not data
     */
    data?: Array<{[key: string]: any}>,
    variant?: 'line' | 'bar',
    outline?: boolean,
    headerIsOutside?: boolean,
    headerPaddingTop?: number | string,
    /**
     * When there is only 1 x-axis key, a string will be passed
     * But when there are many, like in the case of a graph with
     * a selectorOptions prop set and the data associated with the
     * options don't have the same x-axis key, an object mapping
     * the name of the option to the x-axis key of the option is
     * used as xAxisKey
     */
    xAxisKey: GraphXAxisKey;
}

type GraphXAxisKey = string | {
    [key: string]: string
}

type SelectorOptions = {
    [key: string]: Array<{[key: string]: any}>
}


export type {
    GraphData,
    BaseGraphPropTypes,
    GraphHeadingPropTypes,
    GraphPropTypes,
    GraphXAxisKey,
    SelectorOptions
}