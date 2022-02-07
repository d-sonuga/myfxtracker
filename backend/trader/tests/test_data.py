class SignUpDetails:
    """
    The howYouHeard and yearsSpentTrading fields were added long after the
    initial tests were written. But they don't affect things
    The cases concerning them are not covered or even taken note of
    """
    other_values = {
        'howYouHeard': 'on social media',
        'yearsSpentTrading': '3 - 5 years'
    }
    good_details = {
        'email': 'sonugademilade8703@gmail.com',
        'password1': 'password',
        'password2': 'password',
        **other_values
    }
    bad_details_only_email = {
        'email': 'sonugademilade8703@gmail.com',
        'howYouHeard': 'On social media',
        'yearsSpentTrading': '3 - 5 years'
    }
    bad_details_only_password1 = {
        'password1': 'password',
        **other_values
    }
    bad_details_only_password2 = {
        'password2': 'password' ,
        **other_values
    }
    bad_details_email_missing = {
        'password1': 'password',
        'password2': 'password',
        **other_values
    }
    bad_details_password2_missing = {
        'email': 'sonugademilade8703@gmail.com',
        'password1': 'password',
        **other_values
    }
    bad_details_password1_missing = {
        'email': 'sonugademilade8703@gmail.com',
        'password2': 'password',
        **other_values
    }
    bad_details_invalid_email = {
        'email': 'email.com',
        'password1': 'password',
        'password2': 'password',
        **other_values
    }
    bad_details_passwords_not_match = {
        'email': 'sonugademilade8703@gmail.com',
        'password1': 'password',
        'password2': 'password2',
        **other_values
    }
    bad_details_password_length = {
        'email': 'sonugademilade8703@gmail.com',
        'password1': 'pass',
        'password2': 'pass',
        **other_values
    }
    good_details_password_change = {
        'email': 'sonugademilade8703@gmail.com',
        'password1': 'newpassword',
        'password2': 'newpassword',
        **other_values
    }
    good_details_password_reset = {
        'email': 'sonugademilade8703@gmail.com',
        'password1': 'resettedpassword',
        'password2': 'resettedpassword',
        **other_values
    }

class LoginDetails:
    good_details = {
        'email': 'sonugademilade8703@gmail.com',
        'password': 'password',
    }
    bad_details_user_email_doesnt_exist = {
        'email': 'noexist@gmail.com',
        'password': 'password',
    }
    bad_details_wrong_password = {
        'email': 'sonugademilade8703@gmail.com',
        'password': 'wrongpassword'
    }
    bad_details_email_not_verified = {
        'email': 'unverified_email@gmail.com',
        'password': 'password'
    }
    bad_detail_email_missing = {
        'password': 'password'
    }
    bad_details_password_missing = {
        'email': 'sonugademilade8703@gmail.com'
    }
    bad_details_no_email_or_password = {}
