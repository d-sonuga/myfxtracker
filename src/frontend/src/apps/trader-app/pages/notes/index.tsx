import {useEffect, useState} from 'react'
import {usePlateStore} from '@udecode/plate-core'
import {PageContainer, PageHeading} from '@apps/trader-app/components'
import {ColumnBox} from '@components/containers'
import Note from './models'
import NoteList from './note-list'
import NoteEditor from './note-editor'
import MainToolbar from './main-toolbar'
import NoNotesFound from './no-notes-found'
import {PageStillLoading} from '@apps/trader-app/components'
import {NotebookPropTypes} from './types'


const Notebook = ({noteData}: NotebookPropTypes) => {
    // Index of currently chosen note in noteItems
    const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
    const [isEditing, setIsEditing] = useState(false);
    const [notesHasLoaded, setNotesHasLoaded] = useState(false);
    const [noteItems, setNoteItems] = useState<Note[]>([]);
    const setEditorValue = usePlateStore().set.value;
    useEffect(() => {
        noteData.then((rawNoteData) => {
            setNoteItems(Note.fromRawData(rawNoteData));
            setNotesHasLoaded(true);
        })
    }, [])
    const createNewNote = () => {
        const newNote = new Note();
        const newNoteItems = [...noteItems, newNote];
        setNoteItems(newNoteItems);
        setCurrentNoteIndex(newNoteItems.length - 1);
        setEditorValue(newNote.content);
        setIsEditing(true);
    }
    const setCurrentNoteTitle = (title: string) => {
        if(title.length <= 10000){
            const newNoteItems = [...noteItems];
            newNoteItems[currentNoteIndex].title = title;
            setNoteItems(newNoteItems);
            newNoteItems[currentNoteIndex].save();
        }
    }
    const setCurrentNoteContent = (content: any) => {
        const newNoteItems = [...noteItems];
        newNoteItems[currentNoteIndex].content = content;
        setNoteItems(newNoteItems);
        newNoteItems[currentNoteIndex].save();

    }
    const showAllNotes = () => {
        const currentNote = noteItems[currentNoteIndex];
        if(!currentNote.hasBeenSaved()){
            const newNoteItems = noteItems.filter((note, i) => i !== currentNoteIndex);
            setNoteItems(newNoteItems);
        }
        setIsEditing(false);
    }
    if(!notesHasLoaded){
        return <PageStillLoading />
    }
    return(
        <PageContainer showDataStatusBar={false}>
            <PageHeading heading='Notes' dontShowSelector={true} />
            <ColumnBox data-testid='notebook'>
                <MainToolbar 
                    isEditing={isEditing}
                    showAllNotes={showAllNotes}
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
                                removeNoteFromList={(noteIndex: number) => {
                                    // Call function to remove note from list
                                    const newNoteItems = noteItems.filter((note, index) => (
                                        index !== noteIndex
                                    ));
                                    setNoteItems(newNoteItems);
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