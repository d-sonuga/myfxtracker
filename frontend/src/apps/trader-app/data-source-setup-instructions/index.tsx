import {ColumnBox, RowBox} from '@components/containers'
import LoadingIcon from '@components/loading-icon'
import {H5, H6, P} from '@components/text'
import {getColor} from '@conf/utils'


const DataSourceSetupInstructions = ({eaDownloadUrl}: {eaDownloadUrl: string}) => {
    return(
        <ColumnBox
            style={{width: '100%', height: '75vh', justifyContent: 'center', alignItems: 'center'}}
            data-testid='data-source-setup-instructions'>
            <H5>No Accounts Found</H5>
            <P>Your stats will appear once you set up the MyFxTracker EA</P>
            <H6>How to start using MyFxTracker</H6>
            <ol>
                <li>
                    <RowBox style={{alignItems: 'baseline'}}>
                        <P>Download the MyFxTracker EA from &nbsp;</P>
                        <a
                            href={eaDownloadUrl}
                            download='MyFxTrackerEA.txt'
                            style={{
                                color: getColor('light-blue'),
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                            data-testid='download-ea'>here</a>
                    </RowBox>
                </li>
                <li><P>Open your Metatrader terminal</P></li>
                <li><P>Press Ctrl + O </P></li>
                <li><P>Tick allow WebRequest for listed url and enter https://myfxtracker.com</P></li>
                <li><P>Launch the EA</P></li>
                <li><P>Check back in a minute and reload the page</P></li>
            </ol>
        </ColumnBox>
    )
}


export default DataSourceSetupInstructions