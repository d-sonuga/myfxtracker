import {useEffect} from 'react'
import {ColumnBox} from '@components/containers'
import { Divider, Drawer, List, Slide, Tab, Tabs } from '@mui/material'
import { useRef, useState } from 'react'
import NoteListItem from './note-list-item'


const NoteList = ({noteItems, onNoteSelect, isEditing, deleteNote}: {noteItems: any, onNoteSelect: Function, isEditing: boolean, deleteNote: Function}) => {
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
                                deleteNote={deleteNote} />
                            <Divider />
                        </>
                    ))}
                </List>
            </Slide>
        </div>
    )
}

export default NoteList