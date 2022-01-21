import {RowBox} from '@components/containers'
import {H6} from '@components/text'
import {getDimen} from '@conf/utils'
import {ChipSelectInput} from '@components/inputs'
import {GraphHeadingPropTypes} from './types'


const GraphHeading = ({title, selectorOptions, onSelectorSelectedOptionChange, paddingLeft, paddingTop}: GraphHeadingPropTypes) => {
    if(title === undefined && selectorOptions === undefined){
        return null
    }
    return(
        <RowBox
            style={{
                paddingBottom: getDimen('padding-xs'),
                paddingRight: getDimen('padding-sm'),
                paddingTop: paddingTop !== undefined ? paddingTop : getDimen('padding-sm'),
                paddingLeft: paddingLeft !== undefined ? paddingLeft : getDimen('padding-sm'),
                justifyContent: 'space-between'
            }}>
            {title !== undefined ? <H6>{title}</H6> : null}
            {selectorOptions !== undefined ?
                <ChipSelectInput
                    options={Object.keys(selectorOptions)}
                    onChange={(option: string) => onSelectorSelectedOptionChange(option)} />
                : null
            }
        </RowBox>
    )
}

export default GraphHeading