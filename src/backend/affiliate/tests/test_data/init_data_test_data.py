from trader.tests.test_data import LoginDetails


class InitDataTestData:
    details = LoginDetails.good_details
    def users_details():
        details = []
        for i in range(0, 10):
            d = LoginDetails.good_details
            new_email = d['email'].split('.')[0] + str(i) + '.com'
            details.append({**d, 'email': new_email})
        return details
