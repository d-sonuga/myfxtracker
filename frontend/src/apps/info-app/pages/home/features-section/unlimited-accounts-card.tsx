import unlimitedAccountsImg from '@visuals/images/unlimited-accounts.png'
import BaseFeatureCard from './base-feature-card';


const UnlimitedAccountsCard = () => {
    return(
        <BaseFeatureCard
            imgSrc={unlimitedAccountsImg}
            header='Unlimited Accounts'
            content='Greetings from the other side. Lorem ipsum dolor sit amet. Avec to pourqui
            tu faus' />
    );
}

export default UnlimitedAccountsCard