import anyBrokerImg from '@visuals/images/any-broker.png'
import BaseFeatureCard from './base-feature-card'


const AnyBrokerCard = () => {
    return(
        <BaseFeatureCard
            imgSrc={anyBrokerImg}
            header='Any Broker'
            content='Greetings from the other side. Lorem ipsum dolor sit amet. Avec to pourqui
            tu faus' />
    );
}

export default AnyBrokerCard