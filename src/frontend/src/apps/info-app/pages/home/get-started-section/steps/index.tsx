import {H4, H3, H6} from '@components/text'
import {getDimen} from '@conf/utils'
import {CenterColumnBox, RowBox} from '@components/containers'
import {getColor} from '@conf/utils'
import VerticalDivider from '../vertical-divider'
import './style.css'


const Steps = () => {
    return(
        <div className='apps-info-app-home-get-started-steps-container'>
            <div>
                <H4 style={{
                    textAlign: 'center', 
                    textTransform: 'capitalize',
                    paddingBottom: getDimen('padding-md'),
                    fontWeight: 600
                }}>Get started in 3 easy steps</H4>
                <>
                    {steps.map((step: string, i: number) => (
                        <>
                        <RowBox key={i} style={{width: '100%'}}>
                            <CenterColumnBox>
                                <H3 style={{
                                    color: getColor('light-blue'),
                                    display: 'inline',
                                    marginRight: getDimen('padding-md'),
                                    textAlign: 'left'
                                }}>0{(i + 1).toString()}</H3>
                                {i !== steps.length - 1 ?
                                    <VerticalDivider height={60} marginLeft='0px' marginRight={getDimen('padding-md')} />
                                    : null
                                }
                            </CenterColumnBox>
                            <H6 style={{marginTop: getDimen('padding-xs')}}>{step}</H6>
                        </RowBox>
                        </>
                    ))}
                </>
            </div>
        </div>
    );
}

const steps = [
    'Sign Up for MyFxTracker',
    'Connect Your MetaTrader',
    'Start Tracking Your Performance'
]

export default Steps