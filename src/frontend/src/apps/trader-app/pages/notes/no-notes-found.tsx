import {ColumnBox} from '@components/containers'
import {H6} from '@components/text'


const NoNotesFound = () => {
    return(
        <ColumnBox
            style={{
                width: '100%',
                height: '40vh',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <H6>No Notes Found</H6>
        </ColumnBox>
    )
}

export default NoNotesFound