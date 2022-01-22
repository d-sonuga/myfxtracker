import {getDimen} from '@conf/utils'
import {Input} from '@mui/material'


const TitleInput = ({title, setTitle}: {title: string, setTitle: Function}) => {
    return(
        <Input
            value={title}
            placeholder='Title'
            style={{
                border: 'none',
                fontWeight: 500,
                fontSize: '2rem',
                marginBottom: getDimen('padding-xs')
            }}
            onChange={(e) => setTitle(e.target.value)}
            />
    )
}

export default TitleInput