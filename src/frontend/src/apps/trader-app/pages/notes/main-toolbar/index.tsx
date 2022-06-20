import {PermissionsObj} from '@apps/trader-app/services/types'
import {Button} from '@components/buttons'
import {getDimen} from '@conf/utils'
import {List} from '@mui/material'

const MainToolbar = ({isEditing, showAllNotes, createNewNote, permissions}: {isEditing: boolean, showAllNotes: Function, createNewNote: Function, permissions: PermissionsObj}) => {
    return(
        <List>
            {isEditing ? 
                <Button
                    disabled={!permissions.canModifyNotes}
                    onClick={
                        () => showAllNotes()
                    }>All Notes</Button>
                : 
                <Button
                    disabled={!permissions.canCreateNote}
                    onClick={() => createNewNote()}
                    style={{
                        marginRight: getDimen('padding-xs')
                    }}>New Note</Button>}
        </List>
    )
}

export default MainToolbar