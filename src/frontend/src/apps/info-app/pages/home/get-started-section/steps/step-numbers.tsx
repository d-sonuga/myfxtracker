import {H3} from '@components/text'
import {getColor} from '@conf/utils'
import VerticalDivider from '../vertical-divider'


const StepNumbers = ({dividerHeight}: {dividerHeight: number}) => {

    return(
        <div style={{display: 'flex', justifyContent: 'left', height: '300px'}}>
            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                <H3 style={{color: getColor('light-blue'), display: 'inline'}}>01</H3>
                <VerticalDivider height={dividerHeight} />
                <H3 style={{color: getColor('light-blue')}}>02</H3>
                <VerticalDivider height={dividerHeight} />
                <H3 style={{color: getColor('light-blue')}}>03</H3>
            </div>
        </div>
    )
}

export default StepNumbers