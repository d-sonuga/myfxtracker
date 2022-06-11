describe('User free trial is over, user is subscribed and user visits trader app pages', () => {
    it('All pages should be accessible', () => {
        cy.fixture('subscription/subscribed-user-init-data').then((initData) => {
            cy.intercept('http://localhost:8000/trader/get-init-data', initData).as('initData')
            cy.intercept('http://localhost:8000/trader/get-all-notes', [])
        })
        cy.visit('/app');
        assertNotSubscribeNowPage();
        cy.visit('/app/journal');
        assertNotSubscribeNowPage();
        cy.visit('/app/cash-and-gains');
        assertNotSubscribeNowPage();
        cy.visit('/app/long-short-analysis');
        assertNotSubscribeNowPage();
        cy.visit('/app/pairs-analysis');
        assertNotSubscribeNowPage();
        cy.visit('/app/time-analysis');
        assertNotSubscribeNowPage();
        cy.visit('/app/period-analysis');
        assertNotSubscribeNowPage();
        cy.visit('/app/expenses');
        assertNotSubscribeNowPage();
        cy.visit('/app/notes');
        assertNotSubscribeNowPage();
        cy.visit('/app/settings');
        assertNotSubscribeNowPage();
    })
})

describe('User free trial is not over, user is subscribed and user visits trader app pages', () => {
    it('All pages should be accessible', () => {
        cy.fixture('subscription/free-trial-user-init-data').then((initData) => {
            cy.intercept('http://localhost:8000/trader/get-init-data', initData).as('initData')
            cy.intercept('http://localhost:8000/trader/get-all-notes', [])
        })
        cy.visit('/app');
        assertNotSubscribeNowPage();
        cy.visit('/app/journal');
        assertNotSubscribeNowPage();
        cy.visit('/app/cash-and-gains');
        assertNotSubscribeNowPage();
        cy.visit('/app/long-short-analysis');
        assertNotSubscribeNowPage();
        cy.visit('/app/pairs-analysis');
        assertNotSubscribeNowPage();
        cy.visit('/app/time-analysis');
        assertNotSubscribeNowPage();
        cy.visit('/app/period-analysis');
        assertNotSubscribeNowPage();
        cy.visit('/app/expenses');
        assertNotSubscribeNowPage();
        cy.visit('/app/notes');
        assertNotSubscribeNowPage();
        cy.visit('/app/settings');
        assertNotSubscribeNowPage();
    })
})

describe('User free trial is over, user is not subscribed and user visits trader app pages', () => {
    it('Only subscribe and settings pages should be accessible', () => {
        cy.fixture('subscription/unsubscribed-user-init-data').then((initData) => {
            cy.intercept('http://localhost:8000/trader/get-init-data', initData).as('initData')
            cy.intercept('http://localhost:8000/trader/get-all-notes', [])
        })
        cy.visit('/app');
        assertPageIsFreeTrialOverPage();
        cy.visit('/app/journal');
        assertPageIsFreeTrialOverPage();
        cy.visit('/app/cash-and-gains');
        assertPageIsFreeTrialOverPage();
        cy.visit('/app/long-short-analysis');
        assertPageIsFreeTrialOverPage();
        cy.visit('/app/pairs-analysis');
        assertPageIsFreeTrialOverPage();
        cy.visit('/app/time-analysis');
        assertPageIsFreeTrialOverPage();
        cy.visit('/app/period-analysis');
        assertPageIsFreeTrialOverPage();
        cy.visit('/app/expenses');
        assertPageIsFreeTrialOverPage();
        cy.visit('/app/notes');
        assertPageIsFreeTrialOverPage();
        cy.visit('/app/settings');
        assertNotSubscribeNowPage();
    })
})

const assertNotSubscribeNowPage = () => {
    cy.wait('@initData');
    cy.contains('Your Free Trial is Over').should('not.exist');
    cy.contains('Your Subscription Has Expired').should('not.exist');
}

const assertPageIsFreeTrialOverPage = () => {
    cy.contains('Free Trial Is Over').should('be.visible');
    cy.contains('Subscribe').should('be.visible');
}