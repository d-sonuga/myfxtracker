import {Button} from '@components/buttons'
import {getDimen } from '@conf/utils'
import { Add, Create } from '@mui/icons-material'
import { List, ListItemButton, ListItemIcon } from '@mui/material'

const MainToolbar = ({isEditing, setIsEditing, createNewNote}: {isEditing: boolean, setIsEditing: Function, createNewNote: Function}) => {
    return(
        <List>
            {isEditing ? 
                <Button
                    onClick={
                        () => setIsEditing(false)
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