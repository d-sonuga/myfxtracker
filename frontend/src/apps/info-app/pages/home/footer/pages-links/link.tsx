import {Link as ReactLink} from 'react-router-dom'
import {P} from '@components/text'
import {getColor, getDimen} from '@conf/utils'


const Link = ({children, to}: {children: string, to: string}) => {
    return(
        <ReactLink to={to} style={{marginBottom: getDimen('padding-xs')}}>
            <P style={{
                color: getColor('primary-blue'),
                textAlign: 'left'
            }}>{children}</P>
        </ReactLink>
    );
}

export default Link