class PasswordResetDetails:
    """
    The only field required by password reset is email
    The good details details are only valid (good) if a 
    verified user with the email good_details['email']
    exists in the database
    """
    good_details = {
        'email': 'sonugademilade8703@gmail.com'
    }
    # No email, the only required field
    bad_details_no_email = {}
    bad_details_unverified_email = {
        'email': 'unverifiedemail@gmail.com'
    }

class UserModelAttributesTestData:
    fake_trader_data = {
        'email': 'trader@gmail.com',
        'password': 'password',
        'how_you_heard_about_us': 'on social media',
        'trading_time_before_joining': '3 - 5 years',
        'referrer': None
    }