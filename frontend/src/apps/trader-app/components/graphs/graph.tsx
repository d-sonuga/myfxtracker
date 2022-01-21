import {useEffect, useState} from 'react'
import {getColor, getDimen} from '@conf/utils'
import GraphHeading from './graph-heading'
import LineGraph from './line-graph'
import BarChart from './bar-chart'
import {GraphPropTypes, GraphData, GraphXAxisKey, SelectorOptions} from './types'


const Graph = ({data, variant, title, selectorOptions, outline, headerIsOutside, headerPaddingTop,
        xAxisKey, ...props}
    : GraphPropTypes) => {
    const graphVariant = variant === undefined ? 'line' : variant;
    const [graphData, setGraphData] = useState(initialGraphDataStateValues(data, selectorOptions));
    const [currentXAxisKey, setcurrentXAxisKey] = useState(initialXAxisKeyStateValue(xAxisKey, selectorOptions));
    const onSelectorSelectedOptionChange = (option: string) => {
        if(selectorOptions !== undefined){
            setGraphData(selectorOptions[option]);
            // If it's not a string, then it's an object
            // mapping option names to their respective xAxisKeys
            // for the data they will display
            // Had to use typeof directly because of the Typescript compiler
            if(typeof(xAxisKey) !== 'string'){
                setcurrentXAxisKey(xAxisKey[option]);
            }
        }
    }

    useEffect(() => {
        if(data !== undefined){
            setGraphData(data);
        }
    }, [data])

    useEffect(() => {
        if(selectorOptions !== undefined){
            setGraphData(initialGraphDataStateValues(data, selectorOptions));
        }
    }, [selectorOptions])

    return(
        <div>
        {headerIsOutside ? 
            <GraphHeading 
                title={title}
                selectorOptions={selectorOptions} 
                onSelectorSelectedOptionChange={onSelectorSelectedOptionChange}
                paddingLeft={0}
                paddingTop={headerPaddingTop} />
            : null }
            <div
                style={Object.assign(
                    outline ? {
                        border: `1px solid ${getColor('xlight-blue')}`,
                        paddingRight: getDimen('padding-sm'),
                        borderRadius: '5px'
                    } : {},
                    headerIsOutside ? {
                        paddingTop: getDimen('padding-md'),
                        paddingBottom: getDimen('padding-md')
                    } : {}    
                )}>
                {!headerIsOutside ? 
                    <GraphHeading 
                        title={title}
                        selectorOptions={selectorOptions} 
                        onSelectorSelectedOptionChange={onSelectorSelectedOptionChange}
                        paddingTop={headerPaddingTop} />
                    : null}
                {graphVariant === 'line' ?
                    <LineGraph data={graphData} xAxisKey={currentXAxisKey} {...props} />
                    : <BarChart data={graphData} xAxisKey={currentXAxisKey} {...props} />
                }
            </div>
        </div>
    );
}

const initialGraphDataStateValues = (data?: GraphData, selectorOptions?: {[key: string]: GraphData}) => {
    if(data !== undefined){
        return data;
    }
    if(selectorOptions !== undefined){
        const firstOptionName = Object.keys(selectorOptions)[0];
        return selectorOptions[firstOptionName];
    }
    return []
}

const initialXAxisKeyStateValue = (xAxisKey: GraphXAxisKey, selectorOptions?: SelectorOptions): string => {
    if(typeof(xAxisKey) === 'string'){
        return xAxisKey
    }
    // If xAxisKey is not a string, then it is an object mapping
    // selector option names to their respective xAxisKeys
    // This implies that selectorOptions can't be undefined at this point
    // But to satisfy the Typescript compiler
    if(selectorOptions !== undefined){
        const nameOfFirstOption = Object.keys(selectorOptions)[0];
        return xAxisKey[nameOfFirstOption];
    }
    // This statement can never be reached
    // But... the Typescript compiler
    return ''
}

export default Graph    