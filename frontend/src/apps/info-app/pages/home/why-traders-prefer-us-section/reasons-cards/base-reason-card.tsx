import {RowBox} from '@components/containers'
import {BP, H6} from '@components/text'
import {getColor, getDimen} from '@conf/utils'
import {BaseReasonPropTypes} from './types'


const BaseReasonCard = ({img, heading, content}: BaseReasonPropTypes) => {
    return(
        <div style={{
            boxShadow: '0 10px 20px rgb(41 41 42 / 4%)',
            borderRadius: '8px',
            width: '300px',
            height: '150px',
            padding: getDimen('padding-md'),
            marginBottom: getDimen('padding-sm'),
            marginRight: getDimen('padding-xs'),
            backgroundColor: getColor('white')
            }}>
            <RowBox style={{alignItems: 'center'}}>
                {img}
                <H6 style={{marginLeft: getDimen('padding-xs')}}>{heading}</H6>
            </RowBox>
            <BP style={{color: getColor('gray')}}>{content}</BP>
        </div>
    );
}

export default BaseReasonCard