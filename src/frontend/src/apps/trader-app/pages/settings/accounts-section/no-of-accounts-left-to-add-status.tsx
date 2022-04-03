import {SBP} from '@components/text'


const NoOfAccountsLeftToAddStatus = ({noOfAccounts, maxAccounts}: {noOfAccounts: number, maxAccounts: number}) => {
    if(noOfAccounts >= maxAccounts){
        return(
            <SBP style={{marginBottom: '10px'}}>
                You have reached the maximum number of accounts
            </SBP>
        )
    } else {
        return(
            <SBP style={{marginBottom: '10px'}}>
                You can add only {(maxAccounts - noOfAccounts).toString()} more accounts
            </SBP>
        );
    }
}

export default NoOfAccountsLeftToAddStatus