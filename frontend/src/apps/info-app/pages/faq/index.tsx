import {InfoAppNavbar} from '@apps/info-app/components'
import {CenterColumnBox} from '@components/containers'
import {H6, H4, P} from '@components/text'
import { getDimen } from '@conf/utils'
import Accordion from './accordion'
import questionsAndAnswers from './questions-and-answers'
import './style.css'


const FAQPage = () => {
    return(
        <div>
            <InfoAppNavbar />
            <CenterColumnBox className='apps-info-app-faq-container'>
                <H4 style={{
                    textTransform: 'capitalize',
                    marginBottom: getDimen('padding-md'),
                    textAlign: 'center'
                    }}>Frequently Asked Questions</H4>
                {
                    questionsAndAnswers.map((qa) => 
                        <Accordion
                            question={qa.question}
                            answer={qa.answer} />
                    )
                }
            </CenterColumnBox>
        </div>
    )
}

export default FAQPage
