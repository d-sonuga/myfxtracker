import {CenterColumnBox, ColumnBox, RowBox} from '@components/containers'
import {P, H6} from '@components/text'
import Price from './price'
import './style.css'


const PriceProposal = () => {
    return(
        <ColumnBox>
            <Price />
            
        </ColumnBox>
    )
}

export default PriceProposal