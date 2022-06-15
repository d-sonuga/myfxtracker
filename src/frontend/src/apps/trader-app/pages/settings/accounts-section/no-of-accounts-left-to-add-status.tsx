import {SBP} from '@components/text'


const NoOfAccountsLeftToAddStatus = ({noOfAccounts, maxAccounts, userCanAddAccount}: {noOfAccounts: number, maxAccounts: number, userCanAddAccount: boolean}) => {
    if(noOfAccounts >= maxAccounts){
        return(
            <SBP style={{marginBottom: '10px'}}>
                You have reached the maximum number of accounts
            </SBP>
        )
    }
    if(!userCanAddAccount){
        return (
            <SBP style={{marginBottom: '10px'}}>
                You cannot add any more accounts
            </SBP>
        )
    }
    return(
        <SBP style={{marginBottom: '10px'}}>
            You can add only {(maxAccounts - noOfAccounts).toString()} more accounts
        </SBP>
    );
    
}

export default NoOfAccountsLeftToAddStatus