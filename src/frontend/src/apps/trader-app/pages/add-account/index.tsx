import DataSourceSetupInstructions from '@apps/trader-app/data-source-setup-instructions'

const AddAccount = ({dsUsername}: {dsUsername: string}) => {
    return(
        <DataSourceSetupInstructions dsUsername={dsUsername} addAccount={true} />
    )
}

export default AddAccount