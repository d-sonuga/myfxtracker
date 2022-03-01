import {useNavigate} from 'react-router'
import {ColumnBox, RowBox} from '@components/containers'
import {H5, BP} from '@components/text'
import {ButtonWithArrow} from '@apps/info-app/components'
import {RouteConst} from '@conf/const'
import './style.css'


const PriceProposal = () => {
    const navigate = useNavigate();
    return(
        <ColumnBox style={{width: 'fit-content'}}>
            <RowBox className='apps-info-app-pages-pricing-price'>
                <sup>$</sup>
                <RowBox style={{alignItems: 'baseline'}}>
                    <H5>24.99 &nbsp;</H5>
                    <BP>per month</BP>
                </RowBox>
            </RowBox>
            <ButtonWithArrow
                onClick={() => navigate(`/${RouteConst.INFO_SIGN_UP_ROUTE}`)}>
                    Get 14 days free
            </ButtonWithArrow>
        </ColumnBox>
    )
}

export default PriceProposal