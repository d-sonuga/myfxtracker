import {CenterColumnBox} from '@components/containers'
import {BP} from '@components/text'
import {getColor, getDimen} from '@conf/utils'
import gettingStartedChartsImg from '@visuals/images/get-started-charts.png'
import MtLogos from './mt-logos'
import './style.css'


const WorksWithMt = () => {
    return(
        <div className='apps-info-app-home-get-started-works-with-container'>
            <CenterColumnBox>
            <img src={gettingStartedChartsImg} alt='' height='400px' width='400px' />
            <BP style={{
                textTransform: 'uppercase', 
                color: getColor('dark-gray'), 
                textAlign: 'center',
                paddingTop: getDimen('padding-md'),
                paddingBottom: getDimen('padding-sm')
            }}>Works With:</BP>
            <MtLogos />
            </CenterColumnBox>
        </div>
    );
}

export default WorksWithMt