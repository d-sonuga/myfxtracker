import {ColumnBox} from '@components/containers'
import {getDimen} from '@conf/utils'
import {PageContainerPropTypes} from './types'

const PageContainer = ({children, style, className}: PageContainerPropTypes) => {
    return(
        <ColumnBox
            style={{
                marginLeft: getDimen('padding-big'),
                marginRight: getDimen('padding-big'),
                ...style
            }}
            className={className ? className : ''}>
            {children}
        </ColumnBox>
    )
}

export default PageContainer