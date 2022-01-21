import {H4} from '@components/text'
import {getDimen} from '@conf/utils'
import StepNumbers from './step-numbers'
import StepContent from './step-content'
import './style.css'


const Steps = () => {
    const verticalDividerHeight = 150;

    return(
        <div className='apps-info-app-home-get-started-steps-container'>
            <div>
                <H4 style={{
                    textAlign: 'center', 
                    textTransform: 'capitalize',
                    paddingBottom: getDimen('padding-md'),
                    fontWeight: 600
                }}>Get started in 3 easy steps</H4>
                <div style={{display: 'flex'}}>
                    <StepNumbers dividerHeight={verticalDividerHeight} />
                    <StepContent dividerHeight={verticalDividerHeight} />
                </div>
            </div>
        </div>
    );
}

export default Steps