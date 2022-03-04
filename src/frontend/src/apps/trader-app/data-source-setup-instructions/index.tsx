import ReactGA from 'react-ga4'
import MuiAccordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {ColumnBox, RowBox} from '@components/containers'
import {H5, H6, P, BP} from '@components/text'
import {HttpConst} from '@conf/const'
import {getColor, getDimen} from '@conf/utils'
import InstructionsVideo from './instructions-video'
import step1 from './step1.png'
import step3 from './step3.png'
import step4 from './step4.png'
import step5 from './step5.png'
import step6 from './step6.png'
import step7 from './step7.png'
import clickOptionsStep from './click-options-step.png'


const DataSourceSetupInstructions = ({dsUsername, addAccount}: {dsUsername: string, addAccount?: boolean}) => {
    return(
        <ColumnBox
            style={{
                width: '100%',
                alignItems: 'center',
                marginTop: getDimen('padding-big'),
                paddingBottom: getDimen('padding-xbig')
            }}
            data-testid='data-source-setup-instructions'>
            {addAccount ?
                <>
                    <H5>Add Account</H5>
                    <P>Follow the same process you took to setup your first account</P>
                    <P>Here are the instructions below</P>
                </>
            : <>
                <H5>No Accounts Found</H5>
                <P>Your stats will appear once you set up the MyFxTracker EA</P>
                <H6>How to start using MyFxTracker</H6>
            </>}
            <InstructionsVideo />
            {instructions.map((instruction, i) => (
                <MuiAccordion key={i}
                    TransitionProps={{unmountOnExit: true}}
                    sx={{
                        boxShadow: '0',
                        outline: '0.5px solid rgba(229, 231, 235)',
                        marginTop: getDimen('padding-sm'),
                        width: '80%'
                    }}
                    onClick={() => {
                        ReactGA.event('select_content', {
                            content_type: 'Datasource Setup Instructions',
                            item_id: `The ${i + 1}th instruction`
                        })
                    }}>
                    
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <BP>{instruction.outline}</BP>
                            </AccordionSummary>
                            <AccordionDetails>  
                                {instruction.detail(dsUsername)}
                            </AccordionDetails>
                </MuiAccordion>
            ))}
        </ColumnBox>
    )
}

const instructions = [
    {
        outline: '1. Download the MyFxTracker EA',
        detail: (...args: any) => (
            <ColumnBox>
                <RowBox style={{alignItems: 'baseline'}}>
                    <P>For MT4: &nbsp;</P>
                    <DownloadLink
                        href={`${HttpConst.BASE_URL}/${HttpConst.DOWNLOAD_MT4_EA_URL}`}
                        download='MyFxTracker.ex4'
                        data-testid='download-ea-mt4'>EA for MT4</DownloadLink>
                </RowBox>
                <RowBox style={{alignItems: 'baseline'}}>
                    <P>For MT5: &nbsp;</P>
                    <DownloadLink
                        href={`${HttpConst.BASE_URL}/${HttpConst.DOWNLOAD_MT5_EA_URL}`}
                        download='MyFxTracker.ex5'
                        data-testid='download-ea-mt5'>EA for MT5</DownloadLink>
                </RowBox>
            </ColumnBox>
        )
    },
    {
        outline: '2. Place the EA in your terminal\'s experts folder',
        detail: (...args: any) => (
            <ColumnBox>
                <P>Go to File and click "Open Data Folder"</P>
                <Image src={step1} />
                <P>Inside your data folder, open the "MQL4" folder (for MT4) or "MQL5" folder (for MT5) &gt; "Experts"</P>
                <Image src={step3} />
                <P>Move the downloaded MyFxTracker EA to the "Experts" folder</P>
                <Image src={step4} />
            </ColumnBox>
        )
    },
    {
        outline: '3. Restart your MetaTrader',
        detail: (...args: any) => (
            <P>Close your terminal and re-open it</P>
        )
    },
    {
        outline: '4. Tick "Allow WebRequest for listed url"',
        detail: (...args: any) => (
            <ColumnBox>
                <P>In your MetaTrader terminal menu, go to "Tools" and click "Options"</P>
                <Image src={clickOptionsStep} />
                <P>Tick "Allow WebRequest for listed URL"</P>
                <P>Paste "https://new.myfxtracker.com" in the provided field and click OK</P>
                <Image src={step5} />
            </ColumnBox>
        )
    },
    {
        outline: '5. Launch the EA',
        detail: (dsUsername: string, ...args: any) => (
            <ColumnBox>
                <P>In the Navigator, under Expert Advisors, open "MyFxTracker"</P>
                <Image src={step6} />
                <P>When the EA opens, open the "Inputs" tab</P>
                <P>Paste your MT Username: &nbsp;</P>
                <BP>{dsUsername} &nbsp;</BP>
                <P>in the value field for "DSUsername" and click OK</P>
                <Image src={step7} />
            </ColumnBox>
        )
    }
]

const Image = ({src}: {src: string}) => {
    return(
        <>
            <hr />
            <img src={src} alt='' />
            <hr />
        </>
    )
}

const DownloadLink = ({children, 'data-testid': testId, ...props}: {children: string, [key: string]: any}) => {
    return(
        <a
            style={{
                color: getColor('light-blue'),
                textDecoration: 'underline',
                cursor: 'pointer'
            }}
            data-testid={testId}
            onClick={() => {
                ReactGA.event('select_content', {
                    content_type: 'Datasource Expert Advisor',
                    item_id: testId.slice(-3)
                })
            }}
            {...props}>{children}</a>
    )
}

export default DataSourceSetupInstructions