import {useEffect, useState} from 'react'
import {Transforms} from 'slate'
import {usePlateEditorRef, usePlateStore} from '@udecode/plate-core'
import {PageContainer, PageHeading} from '@apps/trader-app/components'
import {ColumnBox} from '@components/containers'
import NoteList from './note-list'
import NoteEditor from './note-editor'
import MainToolbar from './main-toolbar'
import {useSlateProps} from '@udecode/plate'
import { useSlate } from 'slate-react'
import NoNotesFound from './no-notes-found'

type Note = {
    id: number,
    title: string,
    lastEdited: string,
    content: any
}

const Notebook = () => {
    // Index of currently chosen note in noteItems
    const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
    const [isEditing, setIsEditing] = useState(false);
    const [noteItems, setNoteItems] = useState<Note[]>([/*
        {id: 1,title: 'Note1', lastEdited: 'today at 12:39', content: [{type: 'p', children: [{text: 'Note 1 content'}]}]},
        {id: 2,title: 'Note2', lastEdited: 'today at 12:39', content: [{type: 'p', children: [{text: 'Note 2 content'}]}]},
        {id: 3,title: 'Note3', lastEdited: 'today at 12:39', content: [{type: 'p', children: [{text: 'Note 3 content'}]}]},
        {id: 4,title: 'Note4', lastEdited: 'today at 12:39', content: [{type: 'p', children: [{text: 'Note 4 content'}]}]},
        {id: 5,title: 'Note5', lastEdited: 'today at 12:39', content: [{type: 'p', children: [{text: 'Note 5 content'}]}]},*/
    ]);
    const setEditorValue = usePlateStore().set.value;
    const createNewNote = () => {
        const defaultTitle = '';
        const defaultContent = [{type: 'p', children: [{text: ''}]}];
        const newNoteItems = [...noteItems, {
            id: -1,
            title: defaultTitle,
            content: defaultContent,
            lastEdited: new Date().toDateString()
        }];
        setNoteItems(newNoteItems);
        setCurrentNoteIndex(newNoteItems.length - 1);
        setEditorValue(defaultContent);
        setIsEditing(true);
    }
    const setCurrentNoteTitle = (title: string) => {
        const newNoteItems = [...noteItems];
        newNoteItems[currentNoteIndex].title = title;
        setNoteItems(newNoteItems);
    }
    const setCurrentNoteContent = (content: any) => {
        const newNoteItems = [...noteItems];
        newNoteItems[currentNoteIndex].content = content;
        setNoteItems(newNoteItems);
    }
    return(
        <PageContainer>
            <PageHeading heading='Notes' />
            <ColumnBox>
                <MainToolbar 
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    createNewNote={createNewNote}
                    />
                {noteItems.length === 0 ?
                    <NoNotesFound />
                    : isEditing ?
                        <NoteEditor
                            note={noteItems[currentNoteIndex]}
                            setTitle={setCurrentNoteTitle}
                            setContent={setCurrentNoteContent}
                            />
                        : 
                            <NoteList
                                deleteNote={(noteIndex: number) => {
                                    // Call function to delete note
                                    const newNoteItems = noteItems.filter((note, index) => (
                                        index !== noteIndex
                                    ));
                                    setNoteItems(newNoteItems);
                                    return Promise.resolve();
                                }}
                                noteItems={noteItems}
                                isEditing={isEditing}
                                onNoteSelect={(noteIndex: number) => {
                                    setEditorValue(noteItems[noteIndex].content);
                                    setIsEditing(true);
                                    setCurrentNoteIndex(noteIndex);
                                }}
                            />
                    
                }
            </ColumnBox>
        </PageContainer>
    )
}

export default Notebook