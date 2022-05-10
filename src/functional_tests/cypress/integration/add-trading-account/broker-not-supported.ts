const accountDetails = {
    name: 'Hallow Epsilon',
    login: '234322',
    server: 'FBS-Real',
    password: 'joutbnriugn',
    srvFilePath: 'FBS-Real.srv',
    datFilePath: 'FBS-Real.dat',
    tooBigSrvFilePath: 'FBS-Real-too-big.srv',
    tooBigDatFilePath: 'FBS-Real-too-big.dat',
    jpgFilePath: 'wrong-file-format.jpg'
}

const newInitData = {
    'user_data': {
        'id': 2,
        'email': 'sonugademilade8703@gmail.com',
        'is_subscribed': false,
        'on_free': true
    },
    'trade_data': {
        'current_account_id': -1,
        'last_data_refresh_time': null,
        'accounts': {
            1: {
                'name': accountDetails.name,
                'trades': [],
                'deposits': [],
                'withdrawals': []
            }
        }
    }
}

const inputDetails = () => {
    cy.contains('Account Name').parent().type(accountDetails.name);
    cy.contains('Login').parent().type(accountDetails.login);
    cy.contains('Investor Password').parent().type(accountDetails.password);
    cy.contains('Server').parent().type(accountDetails.server);
}

const submitDetails = () => {
    cy.get('*[data-testid="submit-button"]').click();
}

describe('Add account when broker not supported process', () => {
    /**
     * A user types in his trader account details and the server
     * returns a broker not supported error.
     * The hidden input .srv field should show and become compuslory to submit
     */
    beforeEach(() => {
        /**
         * User should be logged in and have no accounts.
         */
        cy.intercept({
            method: 'POST',
            url: 'http://localhost:8000/trader/add-trading-account/'
        }, {detail: 'pending'})
        cy.intercept({
            method: 'POST',
            url: 'http://localhost:8000/trader/pending-add-trading-account/'
        }, {statusCode: 400, body: {'server': ['Your broker is not supported.']}})
        cy.setLocalStorage('TOKEN', 'rihgbrigbruigbrgyrieybgerubrbgirng');
        const initData = {
            'user_data': {
                'id': 2,
                'email': 'sonugademilade8703@gmail.com',
                'is_subscribed': false,
                'on_free': true
            },
            'trade_data': {
                'current_account_id': -1,
                'last_data_refresh_time': null,
                'accounts': {}
            }
        }
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:8000/trader/get-init-data/'
        }, initData);
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:8000/trader/get-all-notes/'
        }, []);
    })
    describe('With mt4 account an correct details', () => {
        it('Should change display to normal app page with account data ' + 
            'when no error is returned from the backend', () => {
            cy.visit('/app/add-account/');
            inputDetails();
            submitDetails();
            cy.wait(5000);
            cy.contains(
                'Unable to detect automatic broker detection.' +
                'Please upload your broker.srv file (mt4) or server.dat file ' +
                '(mt5) in the last field.'
            ).should('be.visible');
            cy.contains('Your broker .srv file').should('be.visible');
            cy.contains('Upload Broker Info').should('be.visible');
            cy.get('input[type="file"]').attachFile(accountDetails.srvFilePath);
            cy.contains(accountDetails.srvFilePath).should('be.visible');
            cy.contains('Upload Broker Info').should('not.exist');
            
            cy.intercept({
                method: 'POST',
                url: 'http://localhost:8000/trader/pending-add-trading-account/'
            }, newInitData);

            cy.get('button[data-testid="submit-button"]').click();
            cy.wait(5000);
        });
    })
    describe('With mt5 account and correct details', () => {
        it('Should change display to normal app page with account data ' + 
            'when no error is returned from the backend', () => {
            cy.visit('/app/add-account/');
            inputDetails();
            cy.contains('MetaTrader Platform Version').parent().click();
            cy.contains('mt5').click();
            submitDetails();
            cy.wait(5000);
            cy.contains(
                'Unable to detect automatic broker detection.' +
                'Please upload your broker.srv file (mt4) or server.dat file ' +
                '(mt5) in the last field.'
            ).should('be.visible');
            cy.contains('Your server .dat file').should('be.visible');
            cy.contains('Upload Broker Info').should('be.visible');
            cy.get('input[type="file"]').attachFile(accountDetails.datFilePath);
            cy.contains(accountDetails.datFilePath).should('be.visible');
            cy.contains('Upload Broker Info').should('not.exist');
            cy.intercept({
                method: 'POST',
                url: 'http://localhost:8000/trader/pending-add-trading-account/'
            }, newInitData);

            cy.get('button[data-testid="submit-button"]').click();
            cy.wait(5000);
        })
    })
   describe('With mt4 account and .srv file too large', () => {
        it('Should display file too large error', () => {
            cy.visit('/app/add-account/');
            inputDetails();
            submitDetails();
            cy.wait(5000);
            cy.contains(
                'Unable to detect automatic broker detection.' +
                'Please upload your broker.srv file (mt4) or server.dat file ' +
                '(mt5) in the last field.'
            ).should('be.visible');
            cy.get('input[type="file"]').attachFile(accountDetails.tooBigSrvFilePath);
            cy.contains('The file is too big').should('be.visible');
            cy.get('button[data-testid="submit-button"]').should('be.disabled');
        })
   })
   describe('With mt5 account and .dat file too large', () => {
        it('Should display file too large error', () => {
            cy.visit('/app/add-account/');
            inputDetails();
            cy.contains('MetaTrader Platform Version').parent().click();
            cy.contains('mt5').click();
            submitDetails();
            cy.wait(5000);
            cy.contains(
                'Unable to detect automatic broker detection.' +
                'Please upload your broker.srv file (mt4) or server.dat file ' +
                '(mt5) in the last field.'
            ).should('be.visible');
            cy.get('input[type="file"]').attachFile(accountDetails.tooBigDatFilePath);
            cy.contains('The file is too big').should('be.visible');
            cy.get('button[data-testid="submit-button"]').should('be.disabled');
        })
    })
    describe('With mt4 account and .dat file is uploaded', () => {
        it('Should display wrong broker info error', () => {
            cy.visit('/app/add-account/');
            inputDetails();
            submitDetails();
            cy.wait(5000);
            cy.contains(
                'Unable to detect automatic broker detection.' +
                'Please upload your broker.srv file (mt4) or server.dat file ' +
                '(mt5) in the last field.'
            ).should('be.visible');
            cy.get('input[type="file"]').attachFile(accountDetails.datFilePath);
            cy.contains('Should be a .srv file for mt4. Change mt version to 5 to upload .dat file')
                .should('be.visible');
            cy.get('button[data-testid="submit-button"]').should('be.disabled');
        })
   })
   describe('With mt5 account and .srv file is uploaded', () => {
        it('Should display wrong broker info error', () => {
            cy.visit('/app/add-account/');
            inputDetails();

            cy.contains('MetaTrader Platform Version').parent().click();
            cy.contains('mt5').click();
            submitDetails();
            cy.wait(5000);
            cy.contains(
                'Unable to detect automatic broker detection.' +
                'Please upload your broker.srv file (mt4) or server.dat file ' +
                '(mt5) in the last field.'
            ).should('be.visible');
            cy.get('input[type="file"]').attachFile(accountDetails.srvFilePath);
            cy.contains('Should be a .dat file for mt5. Change mt version to 4 to upload .srv file')
                .should('be.visible');
            cy.get('button[data-testid="submit-button"]').should('be.disabled');
        })
    })
    describe('With mt4 account and random file is uploaded, neither .srv nor .dat', () => {
        it('Should display wrong broker info error', () => {
            cy.visit('/app/add-account/');
            inputDetails();
            submitDetails();
            cy.wait(5000);
            cy.contains(
                'Unable to detect automatic broker detection.' +
                'Please upload your broker.srv file (mt4) or server.dat file ' +
                '(mt5) in the last field.'
            ).should('be.visible');
            cy.get('input[type="file"]').attachFile(accountDetails.jpgFilePath);
            cy.contains('Should be a .srv file')
                .should('be.visible');
            cy.get('button[data-testid="submit-button"]').should('be.disabled');
        })
    })
    describe('With mt5 account and random file is uploaded, neither .srv nor .dat', () => {
        it('Should display wrong broker info error', () => {
            cy.visit('/app/add-account/');
            inputDetails();
            cy.contains('MetaTrader Platform Version').parent().click();
            cy.contains('mt5').click();
            submitDetails();
            cy.wait(5000);
            cy.contains(
                'Unable to detect automatic broker detection.' +
                'Please upload your broker.srv file (mt4) or server.dat file ' +
                '(mt5) in the last field.'
            ).should('be.visible');
            cy.get('input[type="file"]').attachFile(accountDetails.jpgFilePath);
            cy.contains('Should be a .dat file')
                .should('be.visible');
            cy.get('button[data-testid="submit-button"]').should('be.disabled');
        })
    })
})