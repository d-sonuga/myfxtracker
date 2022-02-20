import {Paper, TableContainer, Table as MuiTable, TableHead, 
    TableCell, TableBody, TableRow} from '@mui/material'
import {BP, H6} from '@components/text'
import {getColor, getDimen} from '@conf/utils'
import {TablePropTypes, ConditionalStyle, HeaderItem, HeaderItemObject} from './types'


const Table = ({title, headers, rows, style, bodyColumnConditionalStyle, headerStyle,
        headerRowConditionalStyle, headerColumnConditionalStyle, headerColumnTextConditionalStyle,
        headerTextStyle, headerRowTextConditionalStyle, bodyStyle, bodyRowConditionalStyle, 'data-testid': testId}
    : TablePropTypes) => {
    return(
        <div data-testid={testId}>
        {title ? 
            <H6 style={{marginBottom: getDimen('padding-xs')}}>{title}</H6>
            : null
        }
        <TableContainer 
            component={Paper} 
            sx={{
                boxShadow: 'none',
                border: `1px solid ${getColor('xlight-blue')}`,
                borderRadius: '1%'
            }}>
            <MuiTable sx={{height: '100%'}}>
                <TableHead>
                    {(() => {
                        if(headers !== undefined){
                            const headersArray: Array<HeaderItemObject[]> = formatHeaders(headers);
                            return headersArray.map((headers, rowi) => {
                                const conditionalRowStyle = getConditionalStyles(rowi, headerRowConditionalStyle);
                                const conditionalRowTextStyle = getConditionalStyles(rowi, headerRowTextConditionalStyle);
                                return(
                                    <TableRow>
                                        {headers.map((headerItem: HeaderItemObject, coli: number) => {
                                            const conditionalColumnTextStyle = getConditionalStyles(coli, headerColumnTextConditionalStyle);
                                            const conditionalColumnStyle = getConditionalStyles(coli, headerColumnConditionalStyle);
                                            const headerCellStyle = headerStyle ? headerStyle : {};
                                            const textStyle = headerTextStyle ? headerTextStyle : {};
                                            const globalStyle = style ? style : {};
                                            return(
                                                <TableCell 
                                                    key={rowi + coli} 
                                                    sx={{
                                                        textAlign: 'center',
                                                        ...globalStyle,
                                                        ...headerCellStyle,
                                                        ...conditionalRowStyle,
                                                        ...conditionalColumnStyle
                                                    }}
                                                    colSpan={headerItem.colSpan}>
                                                    <BP style={{
                                                        color: getColor('light-blue'),
                                                        ...textStyle,
                                                        ...conditionalRowTextStyle,
                                                        ...conditionalColumnTextStyle,
                                                    }}>{headerItem.name}</BP>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            }
                            );
                        }
                        return null;
                    })()}
                </TableHead>
                <TableBody>
                    {rows.map((row, rowi) => {
                        let conditionalRowStyles = getConditionalStyles(rowi, bodyRowConditionalStyle);
                        return(
                            <TableRow key={rowi}>
                                {row.map((cell, coli) => {
                                    const conditionalColumnStyles = getConditionalStyles(coli, bodyColumnConditionalStyle);
                                    const bodyCellStyle = bodyStyle ? bodyStyle : {};
                                    const globalStyle = style ? style : {};
                                    return(
                                        <TableCell 
                                            key={rowi + coli}
                                            align='center'
                                            sx={{
                                                ...globalStyle,
                                                ...bodyCellStyle,
                                                ...conditionalColumnStyles,
                                                ...conditionalRowStyles
                                            }}>
                                            {cell}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </MuiTable>
        </TableContainer>
        </div>
    );
}


/**
 * 
 * @param i: the index of whatever row or column calling the function.
 *  This parameter is passed to a conditionalStyle's condition function to determine
 *  whether or not to add the style associated with that conditionalStyle's style
 * @param conditionalStyle: an object with an object of styles and a condition function
 *  which takes the column or row index as an argument and returns a boolean that 
 * determines whether or not to apply that style or an array of the same
 * @returns: a single object of all the styles whose condition evaluated to true
 *  when i is passed as an argument
 */
const getConditionalStyles = (i: number, conditionalStyle?: ConditionalStyle | Array<ConditionalStyle>) => {
    // No style object, no style
    if(conditionalStyle === undefined){
        return {}
    }
    // Array of all conditional style objects
    let conditionalStylesArray: Array<ConditionalStyle> = [];
    if(Array.isArray(conditionalStyle)){
        conditionalStylesArray = conditionalStyle;
    } else {
        conditionalStylesArray.push(conditionalStyle);
    }
    // Array of all style objects that will end up in the final style object
    // For every condition that is false, an empty object is placed in the array
    const stylesArray = conditionalStylesArray.map((conditionalStyle) => (
        conditionalStyle.condition(i) ?
            conditionalStyle.style
            : {}
    ));
    const styles = mergeObject(stylesArray);
    return styles;
}

const mergeObject = (objArray: Array<{[key: string]: any}>): {[key: string]: any} => {
    if(objArray.length === 0){
        return {}
    } else {
        const lastObj = objArray.pop();
        return Object.assign(mergeObject(objArray), lastObj);
    }
}

/**
 * Headers are given as an array of HeaderItems,
 * which could be a string or object.
 * Examples of valid headers (which are the only headers we'll be expecting here)
 *      ['header1', 'header2', 'header3']
 *      [{name: 'header1', colSpan: 2}, {name: 'header2'}, 'header3']
 *      [
 *          [{name: 'header1', colSpan: 2}, {name: 'header2'}, 'header3'],
 *          [{name: 'header1', colSpan: 3}, {name: 'header2'}],
 *      ]
 * The job of this function is to take a @param headers array which could be
 * a combination of any of the forms above, and give a result of the following format
 *      [
 *          [{name: 'header1'}, {name: 'header2'}, {name: 'header3', colSpan: 2}]
 *      ]
 * 
 */
const formatHeaders = (headers: Array<HeaderItem[]> | HeaderItem[]): Array<HeaderItemObject[]> => {
    if(headers.length === 0){
        return [[]]
    }
    // To handle the case where headers is an array of arrays of HeaderItems
    const processMultipleHeaders = () => {
        let headerRows: Array<HeaderItemObject[]> = [];
        for(let i=0; i<headers.length; i++){
            const headerItems = headers[i];
            // headerItems is sure to be an array, but to satisfy the Typescript compiler
            if(Array.isArray(headerItems)){
                const headerRowToAdd = processHeaders(headerItems);
                console.log(headerRowToAdd);
                headerRows.push(headerRowToAdd);
            }
        }
        return headerRows;
    }
    /** 
     * To handle the case where headers is an array of HeaderItems
     * @operation
     * The function assumes that all its items are HeaderItems
     * So it initializes an array, headerRowToAdd, to store the final result
     * It iterates over all the HeaderItems, which can be either strings or objects
     * If it's a string it creates an object with the string as the name and adds it to headerRowToAdd
     * If it's an object, it just adds the object
     * It returns the final array inside another array, according to the description of
     * what this function is supposed to return
     */
    const processHeaders = (headers: HeaderItem[] | Array<HeaderItem[]>) => {
        const headerRowToAdd: HeaderItemObject[] = [];
        for(let i=0; i<headers.length; i++){
            const headerItem = headers[i];
            if(typeof(headerItem) === 'string'){
                headerRowToAdd.push({name: headerItem});
            // Apart from strings, the only other possible type is an object
            // but this additional check had to be added to satisfy the Typescript
            // compiler
            } else if(typeof(headerItem) === 'object' && !Array.isArray(headerItem)){
                headerRowToAdd.push(headerItem);
            }
        }
        return headerRowToAdd;
    }
    if(Array.isArray(headers[0])){
        return processMultipleHeaders();
    } else {
        // processHeaders returns a single array of HeaderItems
        return [processHeaders(headers)];
    }
}

export default Table
// For testing
export {formatHeaders}