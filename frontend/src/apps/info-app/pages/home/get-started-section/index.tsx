import WorksWithMt from './works-with-mt'
import Steps from './steps'
import './style.css'


const GettingStartedSection = () => {
    return(
        <div className='apps-info-app-home-get-started-section-container'>
            <WorksWithMt />
            <Steps />
        </div>
    );
}

export default GettingStartedSection