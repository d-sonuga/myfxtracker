CHARGE_SUCCESS = {
    "event":"charge.success",
    "data": {
            "id":1362072404,
            "domain":"test",
            "status":"success",
            "reference":"T852939797768278",
            "amount":900000,
            "message":None,
            "gateway_response":"Successful",
            "paid_at":"2021-10-02T10:56:54.000Z",
            "created_at":"2021-10-02T10:56:45.000Z",
            "channel":"card","currency":"NGN",
            "ip_address":"197.210.53.194",
            "metadata": {
                    "custom_filters": {
                            "recurring":True
                        },
                    "referrer":"https://paystack.com/pay/jg-gwrb-yu"
                },
            "log": {
                "start_time":1633172207,
                "time_spent":9,
                "attempts":1,
                "errors":0,
                "success":True,
                "mobile":False,
                "input":[],
                "history":[
                    {"type":"action","message":"Attempted to pay with card","time":6},
                    {"type":"success","message":"Successfully paid with card","time":9}
                ]
            },
            "fees":23500,
            "fees_split":None,
            "authorization": {
                "authorization_code":"AUTH_1krt24woua",
                "bin":"408408",
                "last4":"4081",
                "exp_month":"12",
                "exp_year":"2030",
                "channel":"card",
                "card_type":"visa ",
                "bank":"TEST BANK",
                "country_code":"NG",
                "brand":"visa",
                "reusable":True,
                "signature":"SIG_1V9mZhKlsP627yOOwF24",
                "account_name":None,
                "receiver_bank_account_number":None,
                "receiver_bank":None
            },
            "customer": {
                "id":57316959,
                "first_name":"Demilade",
                "last_name":"Sonuga",
                "email":"sonugademilade8703@gmail.com",
                "customer_code":"CUS_mjzubf01xo35imh",
                "phone":"",
                "metadata":None,
                "risk_action":"default",
                "international_format_phone":None
            },
            "plan": {
                "id":165692,
                "name":"myfxtrackerplan",
                "plan_code":"PLN_p6886el6i4m1w37",
                "description":"A trading journal for forex traders",
                "amount":900000,"interval":"monthly",
                "send_invoices":True,
                "send_sms":True,
                "currency":"NGN"
            },
            "subaccount":{},
            "split":{},
            "order_id":None,
            "paidAt":"2021-10-02T10:56:54.000Z",
            "requested_amount":900000,
            "pos_transaction_data":None,
            "source": {
                "type":"web",
                "source":"checkout",
                "identifier":None
            }
        },
        "order":None,
        "business_name":"MIS"
    }