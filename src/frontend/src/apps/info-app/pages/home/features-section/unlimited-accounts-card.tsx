import unlimitedAccountsImg from '@visuals/images/unlimited-accounts.png'
import BaseFeatureCard from './base-feature-card';


const UnlimitedAccountsCard = () => {
    return(
        <BaseFeatureCard
            imgSrc={unlimitedAccountsImg}
            header='Multiple Accounts'
            content='Maximise profitability on multiple trading accounts.
            MyFxTracker easily lets you connect and track your performance on up to
            3 accounts.' />
    );
}

export default UnlimitedAccountsCard