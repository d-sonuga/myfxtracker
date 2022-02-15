import MuiAccordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {H6, P} from '@components/text'
import {getDimen} from '@conf/utils'


const Accordion = ({question, answer}: {question: string, answer: string}) => {
    return(
        <MuiAccordion sx={{
            boxShadow: '0',
            outline: '0.5px solid rgba(229, 231, 235)',
            marginTop: getDimen('padding-sm')
            }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}>
                    <H6>{question}</H6>
            </AccordionSummary>
            <AccordionDetails>  
                <P>{answer}</P>
            </AccordionDetails>
        </MuiAccordion>
    )
}

export default Accordion