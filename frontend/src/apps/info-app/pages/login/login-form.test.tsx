import LoginForm from './login-form'
import {act} from 'react-dom/test-utils'
import {render, fireEvent, cleanup, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {waitFor} from '@testing-library/dom'
import {SubmitValuesTypes} from './types'

/**
 * @note These tests are far from done
 */

let dummySubmitFunction: any = null;
let dummyStorageService: any = null;
let dummyNavigateFunction: any = null;

beforeEach(() => {
    dummySubmitFunction = jest.fn();
    dummyStorageService = {
        setItem: jest.fn()
    }
    dummyNavigateFunction = jest.fn();
})

afterEach(() => {
    cleanup();
});

test('LoginForm renders correctly on initial render', () => {
    const renderResult = render(
        <LoginForm
            submitValues={dummySubmitFunction}
            storageService={dummyStorageService}
            navigate={dummyNavigateFunction}
            />
    );
    const {getAllByText, getByTestId, getByText} = renderResult;
    const headerAndButton = getAllByText(/Log In/i);
    const emailInput = getByText(/Email/i);
    const passwordInput = getByText(/Password/i);
    const submitButton = getByTestId('submit-button');

    userEvent.click(submitButton, undefined, {skipPointerEventsCheck: true});
    expect(headerAndButton.length).toBe(2);
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(dummySubmitFunction).toHaveBeenCalledTimes(0);
})

test('Submit button doesnt work when only email is inputted', async () => {
    const renderResult = render(
        <LoginForm
            submitValues={dummySubmitFunction}
            storageService={dummyStorageService}
            navigate={dummyNavigateFunction}
            />
    );
    const {getByText, getByTestId} = renderResult;
    const emailInput = getByText(/Email/i);
    const submitButton = getByTestId('submit-button');
    await waitFor(() => {
        userEvent.type(emailInput, 'dummyemail@gmail.com');
        userEvent.click(submitButton, undefined, {skipPointerEventsCheck: true});
    })
    expect(dummySubmitFunction).toHaveBeenCalledTimes(0);
})

test('An error is shown when an invalid email has been inputted', async () => {
    const renderResult = render(
        <LoginForm
            submitValues={dummySubmitFunction}
            storageService={dummyStorageService}
            navigate={dummyNavigateFunction}
            />
    );
    const {getByText, getByTestId} = renderResult;
    const emailInput = getByTestId(/email/i);

    
    fireEvent.change(emailInput, {target: {value: 'an invalid email'}});
    expect(emailInput).toHaveValue('an invalid email');
    await waitFor(() => {
        expect(getByText(/email must be a valid email/i)).toBeInTheDocument();
    })

    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'anotherinvalidemail');
    expect(emailInput).toHaveValue('anotherinvalidemail');
    await waitFor(() => {
        expect(getByText(/email must be a valid email/i)).toBeInTheDocument();
    })

    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'anotherinvalidemail.');
    expect(emailInput).toHaveValue('anotherinvalidemail.');
    await waitFor(() => {
        expect(getByText(/email must be a valid email/i)).toBeInTheDocument();
    })

    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'anotherinv.alidemail');
    expect(emailInput).toHaveValue('anotherinv.alidemail');
    await waitFor(() => {
        expect(getByText(/email must be a valid email/i)).toBeInTheDocument();
    })

    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'anotherinvalidemail.com');
    expect(emailInput).toHaveValue('anotherinvalidemail.com');
    await waitFor(() => {
        expect(getByText(/email must be a valid email/i)).toBeInTheDocument();
    })
})

test('Submit button doesnt work when only password is inputted', async () => {
    const renderResult = render(
        <LoginForm
            submitValues={dummySubmitFunction}
            storageService={dummyStorageService}
            navigate={dummyNavigateFunction}
            />
    );
    const {getByText, getByTestId} = renderResult;
    const passwordInput = getByTestId(/password/i);
    const submitButton = getByTestId('submit-button');
    
    await waitFor(() => {
        userEvent.type(passwordInput, 'password');
        userEvent.click(submitButton, undefined, {skipPointerEventsCheck: true});
    })
    expect(dummySubmitFunction).toHaveBeenCalledTimes(0);
})

test('Submit button works when email and password have been inputted', async () => {
    const {getByText, getByTestId} = render(
        <LoginForm
            submitValues={dummySubmitFunction}
            storageService={dummySubmitFunction}
            navigate={dummyNavigateFunction}
            />
    );
    const emailInput = getByTestId('email');
    const passwordInput = getByTestId('password');
    const submitButton = getByTestId('submit-button');

    userEvent.type(emailInput, 'sonugademilade8703@gmail.com');
    userEvent.type(passwordInput, 'password');
    expect(emailInput).toHaveValue('sonugademilade8703@gmail.com');
    expect(passwordInput).toHaveValue('password');
    await waitFor(() => {
        userEvent.click(submitButton);
    })
    expect(dummySubmitFunction).toHaveBeenCalledTimes(1);
})

test('Flow from inputting valid credentials to clicking submit button', async () => {
    // Simulating a success response, with a token key in the response and all
    const dummyToken = 'dummytoken';
    dummySubmitFunction = jest.fn((config: SubmitValuesTypes) => config.successFunc({data: {key: dummyToken}}));
    render(
        <LoginForm
            submitValues={dummySubmitFunction}
            storageService={dummyStorageService}
            navigate={dummyNavigateFunction}
            />
    );
    // The valid credentials to simulate the login with
    const email = 'sonugademilade8703@gmail.com';
    const password = 'password';
    
    // Get the element the user is interacting with
    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const submitButton = screen.getByTestId('submit-button');

    // Input the credentials
    userEvent.type(emailInput, email);
    userEvent.type(passwordInput, password);
    // After iputting the credentials, do the inputs have what we inputted
    expect(emailInput).toHaveValue(email);
    expect(passwordInput).toHaveValue(password);
    // Click the button and wait for all state updates to be done (real users don't notice this wait)
    await waitFor(() => {
        userEvent.click(submitButton);
    })
    // Has the submit function been called after clicking the submit button?
    // It ought to work because the credentials are valid
    expect(dummySubmitFunction).toHaveBeenCalledTimes(1);
    // After receiving the correct token, was the user token stored in the
    // storage?
    expect(dummyStorageService.setItem).toHaveBeenCalledTimes(1);
    expect(dummyStorageService.setItem).toHaveBeenCalledWith('KEY', dummyToken);
    // After storing the token in the storage, was the page redirected to the trader dashboard?
    expect(dummyNavigateFunction).toHaveBeenCalledTimes(1);
    expect(dummyNavigateFunction).toHaveBeenCalledWith('/app');
})
