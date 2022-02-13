import {Plate} from '@udecode/plate'
import Toolbar from './toolbar'
import plugins from './plugins'
import {getDimen} from '@conf/utils'
import TitleInput from './title-input'


const NoteEditor = ({note, setTitle, setContent}: {note: any, setTitle: Function, setContent: Function}) => {
    return(
        <div style={{paddingTop: getDimen('padding-md')}}>
            <TitleInput title={note.title} setTitle={setTitle} />
            <Toolbar />
            <Plate
                plugins={plugins}
                onChange={(newValue) => {
                    setContent(newValue);
                }}
                editableProps={{
                    placeholder: 'Notes...'
                }} />
        </div>
    );
}

export default NoteEditor