import {H6, P} from '@components/text'


const StepContent = ({dividerHeight}: {dividerHeight: number}) => {
    return(
        <div className='apps-info-app-home-getting-started-step-content'>
            <div>
                <H6>Create your account</H6>
                <P>Lorem ipsum dolor sit amet. Kilo nso. Ti ma n gba e leti</P>
            </div>
            <div>
                <H6>Download MyFxTracker EA</H6>
                <P>Lorem ipsum dolor sit amet. Kilo nso. Ti ma n gba e leti</P>
            </div>
            <div>
                <H6>Connect to your Metatrader account</H6>
                <P>Lorem ipsum dolor sit amet. Kilo nso. Ti ma n gba e leti</P>
            </div>
        </div>
    );
}

export default StepContent