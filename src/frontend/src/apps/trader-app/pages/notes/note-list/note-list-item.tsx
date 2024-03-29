import { PermissionsObj } from '@apps/trader-app/services/types';
import {ToastContext} from '@components/toast'
import {Delete} from '@mui/icons-material'
import {IconButton, ListItem, ListItemButton, ListItemText, CircularProgress} from '@mui/material'
import {useContext, useState} from 'react'
import Note from '../models';


const NoteListItem = ({noteItem, active, onClick, removeNoteFromList, noteIndex, permissions}: {noteItem: Note, active: boolean, onClick: Function, removeNoteFromList: Function, noteIndex: number, permissions: PermissionsObj}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const Toast = useContext(ToastContext);
    return(
        <ListItem>
            <ListItemButton
                disabled={isDeleting || !permissions.canModifyNotes}
                onClick={(e) => onClick()}
                selected={active}>
                <ListItemText
                    primary={noteItem.title ? noteItem.title : 'Untitled'}
                    secondary={noteItem.lastEditedToString()}
                    />
            </ListItemButton>
            {isDeleting ? 
                <CircularProgress />
                : <IconButton onClick={() => {
                        setIsDeleting(true);
                        noteItem.delete()
                            .then(() => removeNoteFromList(noteIndex))
                            .catch(() => (
                                Toast.error('Sorry. Something went wrong when trying to delete your note.')
                            ))
                            .then(() => setIsDeleting(false))
                    }}><Delete /></IconButton>
                }
        </ListItem>
    )
}

export default NoteListItem