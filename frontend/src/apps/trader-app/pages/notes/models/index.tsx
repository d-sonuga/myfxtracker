import {Http, HttpErrorType, HttpResponseType} from '@apps/trader-app/services'
import {HttpConst} from '@conf/const'


class Note {
    id;
    title;
    content;
    lastEdited;
    // To synchronize multiple saves
    // If the note is already being saved, append the current state
    private isSaving;
    private saveQueue: NoteData[];
    constructor(noteData?: NoteData | RawNoteData){
        if(noteData){
            this.id = noteData.id;
            this.title = noteData.title;
            this.content = noteData.content;
            if('lastEdited' in noteData){
                this.lastEdited = new Date(noteData.lastEdited);
            } else {
                this.lastEdited = new Date(noteData.last_edited);
            }
        } else {
            this.id = -1;
            this.title = '';
            this.content = [{type: 'p', children: [{text: ''}]}];
            this.lastEdited = new Date();
        }
        this.saveQueue = [];
        this.isSaving = false;
    }

    private _save(data: NoteData){
        const {BASE_URL, SAVE_NOTE_URL, UPDATE_NOTE_URL} = HttpConst;
        let url;
        let httpMethod;
        if(this.id === -1){
            url = `${BASE_URL}/${SAVE_NOTE_URL}/`;
            httpMethod = Http.post;
        } else {
            url = `${BASE_URL}/${UPDATE_NOTE_URL}/${this.id}/`;
            httpMethod = Http.put;
        }
        httpMethod({
            url,
            data,
            successFunc: (resp: HttpResponseType) => {
                this.id = resp.data.id;
                const latestChangeToSave = this.saveQueue.pop();
                // other previous changes dont need to be saved
                this.saveQueue = [];
                if(latestChangeToSave === undefined){
                    this.isSaving = false;
                } else {
                    this._save(latestChangeToSave);
                }
            },
            errorFunc: (err: HttpErrorType) => {
                console.log(err);
                Http.toast.error('Sorry. Something went wrong while trying to save your note.');
            }
        })
    }

    save(){
        if(this.isSaving){
            // save the last state of the note
            this.saveQueue.push({
                id: this.id,
                title: this.title,
                content: this.content,
                lastEdited: this.lastEdited.toISOString()
            })
        } else {
            this.isSaving = true;
            this._save(this.toNoteData())
        }
    }

    delete(): Promise<void> {
        if(this.id === -1){
            return Promise.resolve();
        } else {
            const {BASE_URL, DELETE_NOTE_URL} = HttpConst
            return Http.delete({
                url: `${BASE_URL}/${DELETE_NOTE_URL}/${this.id}/`,
                successFunc: () => {
                    return Promise.resolve()
                },
                errorFunc: () => {
                    return Promise.reject();
                }
            });
        }
    }

    static fromRawData(noteData: NoteData[]): Note[]{
        return noteData.map((data) => new Note(data))
    }

    lastEditedToString(): String {
        return this.lastEdited.toDateString();
    }

    private toNoteData(){
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            lastEdited: this.lastEdited.toISOString()
        }
    }
}

type NoteData = {
    id: number,
    title: string,
    content: any,
    lastEdited: string
}

// From the backend
type RawNoteData = {
    id: number,
    title: string,
    content: any,
    last_edited: string
}

export default Note
export type {
    NoteData
}