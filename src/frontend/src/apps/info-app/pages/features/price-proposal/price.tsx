import {CenterColumnBox, ColumnBox, RowBox} from '@components/containers'
import {P, H6} from '@components/text'


const Price = () => {
    return(
        <RowBox className='fff'>
            <sup>$</sup>
            <RowBox style={{alignItems: 'baseline'}}>
                <H6>24.99 &nbsp;</H6>
                <P>per month</P>
            </RowBox>
        </RowBox>
    )
}

export default Price