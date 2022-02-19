import {Button} from '@components/buttons'
import {getDimen} from '@conf/utils'
import {List} from '@mui/material'

const MainToolbar = ({isEditing, showAllNotes, createNewNote}: {isEditing: boolean, showAllNotes: Function, createNewNote: Function}) => {
    return(
        <List>
            {isEditing ? 
                <Button
                    onClick={
                        () => showAllNotes()
                    }>All Notes</Button>
                : 
                <Button
                    onClick={() => createNewNote()}
                    style={{
                        marginRight: getDimen('padding-xs')
                    }}>New Note</Button>}
        </List>
    )
}

export default MainToolbar