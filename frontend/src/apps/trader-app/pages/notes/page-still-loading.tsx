import {ColumnBox} from '@components/containers'
import LoadingIcon from '@components/loading-icon'
import {getColor} from '@conf/utils'


const PageStillLoading = () => {
    return(
        <ColumnBox
            style={{
                height: '100vh',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <LoadingIcon
                color={getColor('dark-gray')}
                size={50} />
        </ColumnBox>
    )
}

export default PageStillLoading