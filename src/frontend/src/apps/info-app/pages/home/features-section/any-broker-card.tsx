import anyBrokerImg from '@visuals/images/any-broker.png'
import BaseFeatureCard from './base-feature-card'


const AnyBrokerCard = () => {
    return(
        <BaseFeatureCard
            imgSrc={anyBrokerImg}
            header='Any Broker'
            content='Easily switch from one broker to another.
            MyFxTracker works seamlessly with any broker of your choice.' />
    );
}

export default AnyBrokerCard