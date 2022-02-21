import {RowBox} from '@components/containers'
import {H4} from '@components/text'
import {getDimen} from '@conf/utils'
import {AccountSelector} from '..'
import {PageHeadingPropTypes} from './types'

/**
 * A component to display the heading of all pages in the
 * trader app
 * @prop heading: the heading to show at the top of the page
 * @prop dontShowSelector: should the account selector show?
 */

const PageHeading = ({heading, dontShowSelector}: PageHeadingPropTypes) => {
    return(
        <RowBox 
            style={{
                justifyContent: 'space-between',
                marginTop: getDimen('padding-md'),
                marginBottom: getDimen('padding-md')
            }}>
            <H4>{heading}</H4>
            {
                dontShowSelector === undefined || !dontShowSelector ?
                    <AccountSelector />
                    : null
            }
        </RowBox>
    )
}

export default PageHeading