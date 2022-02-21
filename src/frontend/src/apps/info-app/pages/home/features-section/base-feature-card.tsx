import {ColumnBox} from '@components/containers'
import {H5, P} from '@components/text'
import {FeatureCardPropTypes} from './types'


const BaseFeatureCard = ({imgSrc, header, content}: FeatureCardPropTypes) => {
    return(
        <ColumnBox className='apps-info-app-home-features-section-feature-cards-content'>
            <img 
                src={imgSrc} 
                width={64} height={64} alt=''
                style={{paddingTop: '40px'}} />
            <H5>{header}</H5>
            <P>{content}</P>
        </ColumnBox>
    );
}

export default BaseFeatureCard