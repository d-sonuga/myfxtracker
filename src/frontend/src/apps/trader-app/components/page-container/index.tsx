import {ColumnBox} from '@components/containers'
import {getDimen} from '@conf/utils'
import DataStatusBar from './data-status-bar'
import {PageContainerPropTypes} from './types'

const PageContainer = ({children, style, className, showDataStatusBar}: PageContainerPropTypes) => {
    return(
        <ColumnBox
            style={{
                marginLeft: getDimen('padding-big'),
                marginRight: getDimen('padding-big'),
                ...style
            }}
            className={className ? className : ''}>
            {showDataStatusBar !== undefined && !showDataStatusBar ?
                null
                : <DataStatusBar />
            }
            {children}
        </ColumnBox>
    )
}

export default PageContainer