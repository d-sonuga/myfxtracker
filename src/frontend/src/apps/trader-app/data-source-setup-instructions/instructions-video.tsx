import Youtube from 'react-youtube'
import {getDimen} from '@conf/utils'


const InstructionsVideo = () => {
    return(
        <div
            style={{
            marginTop: getDimen('padding-xs'),
            marginBottom: getDimen('padding-xs')
        }}>
            <Youtube
                videoId='TU3bg7RB3Kg'
                title='MyFxTracker Account Setup Tutorial'
                opts={{
                    width: '853',
                    height: '480'
                }}
                />
        </div>
    )
}

export default InstructionsVideo