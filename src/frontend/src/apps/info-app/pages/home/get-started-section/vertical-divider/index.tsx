import {getDimen} from '@conf/utils'
import './style.css'


const VerticalDivider = ({height}: {height?: number}) => {
    return(
        <div style={{
            border: '1px solid #c5c5c5',
            height: height ? `${height}px` : '30px',
            textAlign: 'center',
            marginLeft: getDimen('padding-xs'),
            marginRight: getDimen('padding-xs')
        }}></div>
    )
}

export default VerticalDivider