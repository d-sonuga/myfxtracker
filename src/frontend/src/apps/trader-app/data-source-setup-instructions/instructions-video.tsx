import {getDimen} from '@conf/utils'

const InstructionsVideo = () => {
    return(
        <div style={{
            marginTop: getDimen('padding-xs'),
            marginBottom: getDimen('padding-xs')
        }}>
            <iframe width="853" height="480" 
                src="https://www.youtube.com/embed/Fcw6QNF8jcc"
                title="YouTube video player" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
        </div>
    )
}

export default InstructionsVideo