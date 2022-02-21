import {BarChart as ReBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend, ResponsiveContainer} from 'recharts'
import {BaseGraphPropTypes} from './types'


const BarChart = ({data, xAxisKey, yAxisKey, height, tooltipName}: BaseGraphPropTypes) => {
    return(
        <ResponsiveContainer width='100%' height={height === undefined ? 250 : height}>
            <ReBarChart data={data} barSize={80}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis axisLine={false} tickLine={false} dataKey={xAxisKey} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar
                    dataKey={yAxisKey}
                    name={tooltipName ? tooltipName : undefined}
                    fill="#0d6efd"
                    opacity='0.8' />
            </ReBarChart>
        </ResponsiveContainer>
    );
}

export default BarChart