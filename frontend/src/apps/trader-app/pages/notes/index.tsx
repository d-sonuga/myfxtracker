import {PageContainer, PageHeading} from '@apps/trader-app/components'
import NoteEditor from './note-editor'


const Notebook = () => {
    return(
        <PageContainer>
            <PageHeading heading='Notes' />
            <NoteEditor />
        </PageContainer>
    )
}

export default Notebook