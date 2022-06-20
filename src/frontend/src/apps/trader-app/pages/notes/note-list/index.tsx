import {Divider, List, Slide,} from '@mui/material'
import {useRef} from 'react'
import NoteListItem from './note-list-item'
import Note from '../models'
import { PermissionsObj } from '@apps/trader-app/services/types'


const NoteList = ({noteItems, onNoteSelect, isEditing, removeNoteFromList, permissions}: {noteItems: Note[], onNoteSelect: Function, isEditing: boolean, removeNoteFromList: Function, permissions: PermissionsObj}) => {
    const listContainerRef = useRef<HTMLDivElement>(null);
    return(
        <div ref={listContainerRef}>
            <Slide direction='right' in={!isEditing} container={listContainerRef.current}>
                <List>
                    {noteItems.map((noteItem: any, i: number) => (
                        <>
                            <NoteListItem
                                key={i}
                                noteIndex={i}
                                noteItem={noteItem}
                                active={false}
                                onClick={() => {
                                    onNoteSelect(i);
                                }}
                                removeNoteFromList={removeNoteFromList}
                                permissions={permissions}
                                 />
                            <Divider />
                        </>
                    ))}
                </List>
            </Slide>
        </div>
    )
}

export default NoteList