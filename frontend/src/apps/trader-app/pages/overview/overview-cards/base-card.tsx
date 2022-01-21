import {ColumnBox} from '@components/containers'
import {H4, H5, P} from '@components/text'
import {getDimen} from '@conf/utils'
import {BaseOverviewCardPropTypes} from './types'

/**
 * Base card for the overview page
 */

const BaseOverviewCard = ({heading, content, backgroundColor}: BaseOverviewCardPropTypes) => {
    return(
        <ColumnBox 
            className='apps-trader-app-pages-overview-base-overview-card'
            style={{backgroundColor: backgroundColor}}>
            <P>{heading}</P>
            <H5>{content}</H5>
        </ColumnBox>
    )
}

export default BaseOverviewCard