import {InfoAppNavbar} from '@apps/info-app/components'
import BlushDesign from './blush-design'
import FirstHeadingSection from './first-heading-section'
import DemoVideo from './demo-video'
import FeaturesSection from './features-section'
import GettingStartedSection from './get-started-section'
import WhyTradersPreferUsSection from './why-traders-prefer-us-section'
import ReviewSection from './review-section'
import SignUpOfferingSection from './sign-up-offering-section'
import Footer from './footer'


const HomePage = () => {
    return(
        <div>
            <InfoAppNavbar />
            <BlushDesign />
            <FirstHeadingSection />
            <DemoVideo />
            <FeaturesSection />
            <GettingStartedSection />
            <WhyTradersPreferUsSection />
            <ReviewSection />
            <SignUpOfferingSection />
            <Footer />
        </div>
    );
}

export default HomePage