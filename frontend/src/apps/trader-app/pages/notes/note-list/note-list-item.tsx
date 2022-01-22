import { ColumnBox } from '@components/containers'
import { P, SP } from '@components/text'
import { getColor, getDimen } from '@conf/utils'
import { Delete } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, CircularProgress } from '@mui/material'
import { useState } from 'react'


const NoteListItem = ({noteItem, active, onClick, deleteNote, noteIndex}: {noteItem: any, active: boolean, onClick: Function, deleteNote: Function, noteIndex: number}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    return(
        <ListItem>
            <ListItemButton
                disabled={isDeleting}
                onClick={(e) => onClick()}
                selected={active}>
                <ListItemText
                    primary={noteItem.title ? noteItem.title : 'Untitled'}
                    secondary={noteItem.lastEdited}
                    />
            </ListItemButton>
            {isDeleting ? 
                <CircularProgress />
                : <IconButton onClick={() => {
                        setIsDeleting(true);
                        deleteNote(noteIndex)
                            .then(() => setIsDeleting(false))
                            .catch(() => {
                                setIsDeleting(false);
                            })
                    }}><Delete /></IconButton>
                }
        </ListItem>
    )
}

export default NoteListItem