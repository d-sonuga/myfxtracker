import SignUpForm from './sign-up-form'
import {screen, render, cleanup} from '@testing-library/react'
import {waitFor} from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

/**
 * @note these tests are far from done
 */

let dummySubmitFunction: any = null;

beforeEach(() => {
    dummySubmitFunction = jest.fn();
})
afterEach(cleanup)


test('Sign up form renders properly on initial render', () => {
    render(
        <SignUpForm
            submitValues={dummySubmitFunction}
            />
    );
    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const yearsSpentTradingInput = screen.getByTestId('years-spent-trading');
    const howYouHeard = screen.getByTestId('how-you-heard');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(yearsSpentTradingInput).toBeInTheDocument();
    expect(howYouHeard).toBeInTheDocument();
})

test('An error is shown when no value is inputted', async () => {
    render(
        <SignUpForm
            submitValues={dummySubmitFunction}
            />
    );
    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const confirmPasswordInput = screen.getByTestId('confirm-password');
    const yearsSpentTradingInput = screen.getByTestId('years-spent-trading');
    const howYouHeard = screen.getByTestId('how-you-heard');
    const submitButton = screen.getByTestId('submit-button');
    
    await waitFor(() => {
        // Errors for a field doesn't show until that field has been in focus
        userEvent.type(emailInput, 'a{backspace}');
        userEvent.type(passwordInput, 'a{backspace}');
        userEvent.type(confirmPasswordInput, 'a{backspace}');
    })
    userEvent.click(submitButton, undefined, {skipPointerEventsCheck: true});
    expect(dummySubmitFunction).toHaveBeenCalledTimes(0);
    await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    })
})