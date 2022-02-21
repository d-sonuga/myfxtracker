import {getColor} from '@conf/utils'
import {AreaChart, CartesianGrid, XAxis, YAxis, Area, Tooltip, ResponsiveContainer} from 'recharts'
import {BaseGraphPropTypes} from './types'


const LineGraph = ({data, xAxisKey, yAxisKey, height, tooltipName}: BaseGraphPropTypes) => {
    return(
        <ResponsiveContainer width='100%' height={height === undefined ? 250 : height}>
            <AreaChart
                data={data}
                margin={{ 
                    top: 10, right: 30, left: 0, bottom: 0 
                }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#9ec5ff" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <XAxis axisLine={false} tickLine={false} tick={false} dataKey={xAxisKey} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: getColor('dark-gray')}} />
                <Tooltip />
                <Area
                    type='monotone'
                    dataKey={yAxisKey}
                    name={tooltipName ? tooltipName : undefined}
                    stroke='#0d6efd' 
                    strokeWidth={2} 
                    fillOpacity={1}
                    fill="url(#colorUv)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}


export default LineGraph