import unlimitedAccountsImg from '@visuals/images/unlimited-accounts.png'
import BaseFeatureCard from './base-feature-card';


const UnlimitedAccountsCard = () => {
    return(
        <BaseFeatureCard
            imgSrc={unlimitedAccountsImg}
            header='Unlimited Accounts'
            content='Maximise profitability on all of your trading accounts.
            MyFxTracker easily lets you connect and track your performance on as many
            trading accounts as you have.' />
    );
}

export default UnlimitedAccountsCard