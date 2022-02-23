import {ColumnBox, RowBox} from '@components/containers'
import {H5, H6, P} from '@components/text'
import {HttpConst} from '@conf/const'
import {getColor} from '@conf/utils'


const DataSourceSetupInstructions = ({dsUsername, eaDownloadUrls}: {dsUsername: string, eaDownloadUrls: {'mt4': string, 'mt5': string}}) => {
    return(
        <ColumnBox
            style={{
                width: '100%',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            data-testid='data-source-setup-instructions'>
            <H5>No Accounts Found</H5>
            <P>Your stats will appear once you set up the MyFxTracker EA</P>
            <H6>How to start using MyFxTracker</H6>
            <ol>
                <li>
                    <RowBox style={{alignItems: 'baseline'}}>
                        <P>Download the &nbsp;</P>
                        <a
                            href={eaDownloadUrls['mt4']}
                            download='MyFxTracker.ex4'
                            style={{
                                color: getColor('light-blue'),
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                            data-testid='download-ea-mt4'>EA for MT4</a>
                        <P>&nbsp; or the &nbsp;</P>
                        <a
                            href={eaDownloadUrls['mt5']}
                            download='MyFxTracker.ex5'
                            style={{
                                color: getColor('light-blue'),
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                            data-testid='download-ea-mt5'>EA for MT5</a>
                    </RowBox>
                </li>
                <li><P>Open your Metatrader terminal</P></li>
                <li><P>Press Ctrl + O </P></li>
                <li><P>Tick allow WebRequest for listed url and enter https://new.myfxtracker.com</P></li>
                <li><P>Launch the EA and input your MT username:</P><P>{dsUsername}</P></li>
                <li><P>Check back in a minute and reload the page</P></li>
            </ol>
        </ColumnBox>
    )
}


export default DataSourceSetupInstructions