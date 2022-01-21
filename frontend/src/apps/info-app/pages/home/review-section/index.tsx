import {RowBox} from '@components/containers'
import {H5} from '@components/text'
import StarImages from './star-images'
import './style.css'


const ReviewSection = () => {
    return(
        <div className='apps-info-app-home-review-container'>
            <StarImages />
            <RowBox style={{justifyContent: 'center'}}>
                <H5 style={{textAlign: 'center'}}>"Wow! I'm loving this website, this is what I needed for a long time. Its better than fxbook.
Overall this is perfect. Huge thanks to JI, Ryan for giving me this link."</H5>
            </RowBox>
        </div>
    );
}

export default ReviewSection