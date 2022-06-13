from datetime import datetime


trader_details = {
  'email': 'sonugademilade8703@gmail.com', 
  'password': 'password'
}

verif_hash = 'zemf74gr0874zfh49uzfhpu9zfhmpufhaewyfpy'

test_billing_webhook = lambda trader, time_created: '''{
    "event": "charge.completed",
    "data": {
      "id": 3479452,
      "tx_ref": "user-%(trader_id)d-date-1655118816524",
      "flw_ref": "FLW-MOCK-d03a652eca9bae8bc62893c22a69f8a4",
      "device_fingerprint": "8a9f902753da6e97a6d799774fbca1f4",
      "amount": 23.99,
      "currency": "USD",
      "charged_amount": 23.99,
      "app_fee": 0.92,
      "merchant_fee": 0,
      "processor_response": "Approved. Successful",
      "auth_model": "VBVSECURECODE",
      "ip": "169.239.48.195",
      "narration": "CARD Transaction ",
      "status": "successful",
      "payment_type": "card",
      "created_at": "%(time_created)s",
      "account_id": 753905,
      "customer": {
        "id": 1655705,
        "name": "Anonymous customer",
        "phone_number": null,
        "email": "%(trader_email)s",
        "created_at": "2022-06-13T11:13:50.000Z"
      },
      "card": {
        "first_6digits": "553188",
        "last_4digits": "2950",
        "issuer": "MASTERCARD  CREDIT",
        "country": "NG",
        "type": "MASTERCARD",
        "expiry": "09/32" 
      }
    },
    "event.type": "CARD_TRANSACTION"
  }''' % {'trader_id': trader.id, 'trader_email': trader.email, 'time_created': time_created.isoformat()}

test_unrecognized_webhook = lambda trader, time_created: '''{
    "event": "unrecognized.webhook",
    "data": {
      "id": 3479452,
      "tx_ref": "user-%(trader_id)d-date-1655118816524",
      "flw_ref": "FLW-MOCK-d03a652eca9bae8bc62893c22a69f8a4",
      "device_fingerprint": "8a9f902753da6e97a6d799774fbca1f4",
      "amount": 23.99,
      "currency": "USD",
      "charged_amount": 23.99,
      "app_fee": 0.92,
      "merchant_fee": 0,
      "processor_response": "Approved. Successful",
      "auth_model": "VBVSECURECODE",
      "ip": "169.239.48.195",
      "narration": "CARD Transaction ",
      "status": "successful",
      "payment_type": "card",
      "created_at": "%(time_created)s",
      "account_id": 753905,
      "customer": {
        "id": 1655705,
        "name": "Anonymous customer",
        "phone_number": null,
        "email": "%(trader_email)s",
        "created_at": "2022-06-13T11:13:50.000Z"
      },
      "card": {
        "first_6digits": "553188",
        "last_4digits": "2950",
        "issuer": "MASTERCARD  CREDIT",
        "country": "NG",
        "type": "MASTERCARD",
        "expiry": "09/32" 
      }
    },
    "event.type": "CARD_TRANSACTION"
  }''' % {'trader_id': trader.id, 'trader_email': trader.email, 'time_created': time_created.isoformat()}

test_failed_billing_webhook = lambda trader, time_created: '''{
    "event": "charge.completed",
    "data": {
      "id": 3479452,
      "tx_ref": "user-%(trader_id)d-date-1655118816524",
      "flw_ref": "FLW-MOCK-d03a652eca9bae8bc62893c22a69f8a4",
      "device_fingerprint": "8a9f902753da6e97a6d799774fbca1f4",
      "amount": 23.99,
      "currency": "USD",
      "charged_amount": 23.99,
      "app_fee": 0.92,
      "merchant_fee": 0,
      "processor_response": "Approved. Successful",
      "auth_model": "VBVSECURECODE",
      "ip": "169.239.48.195",
      "narration": "CARD Transaction ",
      "status": "failed",
      "payment_type": "card",
      "created_at": "%(time_created)s",
      "account_id": 753905,
      "customer": {
        "id": 1655705,
        "name": "Anonymous customer",
        "phone_number": null,
        "email": "%(trader_email)s",
        "created_at": "2022-06-13T11:13:50.000Z"
      },
      "card": {
        "first_6digits": "553188",
        "last_4digits": "2950",
        "issuer": "MASTERCARD  CREDIT",
        "country": "NG",
        "type": "MASTERCARD",
        "expiry": "09/32" 
      }
    },
    "event.type": "CARD_TRANSACTION"
  }''' % {'trader_id': trader.id, 'trader_email': trader.email, 'time_created': time_created.isoformat()}