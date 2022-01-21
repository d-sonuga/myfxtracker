"""
Constants for testing
The webhooks were gotten directly from the paypal developer webhook simulator
"""

WEBHOOK_ACTIVATED = {
  "id": "WH-55TG7562XN2588878-8YH955435R661687G",
  "create_time": "2018-19-12T22:20:32.000Z",
  "resource_type": "plan",
  "event_type": "BILLING.PLAN.ACTIVATED",
  "summary": "A billing plan was activated.",
  "resource": {
    "update_time": "2018-12-10T21:20:49Z",
    "create_time": "2018-12-10T21:20:49Z",
    "usage_type": "LICENSED",
    "payment_preferences": {
      "service_type": "PREPAID",
      "auto_bill_outstanding": True,
      "setup_fee": {
        "value": "10",
        "currency_code": "USD"
      },
      "setup_fee_failure_action": "CONTINUE",
      "payment_failure_threshold": 3
    },
    "product_id": "PROD-XXCD1234QWER65782",
    "name": "Zoho Marketing Campaign  Plan",
    "billing_cycles": [
      {
        "frequency": {
          "interval_unit": "MONTH",
          "interval_count": 1
        },
        "tenure_type": "TRIAL",
        "sequence": 1,
        "total_cycles": 1,
        "pricing_scheme": {
          "fixed_price": {
            "value": "50",
            "currency_code": "USD"
          },
          "tier_mode": "VOLUME",
          "tiers": [
            {
              "starting_quantity": "1",
              "ending_quantity": "1000",
              "amount": {
                "value": "100",
                "currency_code": "USD"
              }
            },
            {
              "starting_quantity": "1001",
              "amount": {
                "value": "200",
                "currency_code": "USD"
              }
            }
          ]
        }
      },
      {
        "frequency": {
          "interval_unit": "MONTH",
          "interval_count": 1
        },
        "tenure_type": "REGULAR",
        "sequence": 2,
        "total_cycles": 12,
        "pricing_scheme": {
          "fixed_price": {
            "value": "100",
            "currency_code": "USD"
          },
          "tier_mode": "VOLUME",
          "tiers": [
            {
              "starting_quantity": "1",
              "ending_quantity": "1000",
              "amount": {
                "value": "300",
                "currency_code": "USD"
              }
            },
            {
              "starting_quantity": "1001",
              "amount": {
                "value": "1000",
                "currency_code": "USD"
              }
            }
          ]
        }
      }
    ],
    "description": "Zoho Marketing Campaign Plan",
    "taxes": {
      "percentage": "10",
      "inclusive": False
    },
    "links": [
      {
        "href": "https://api.paypal.com/v1/billing/plans/P-5ML4271244454362WXNWU5NQ",
        "rel": "self",
        "method": "GET"
      },
      {
        "href": "https://api.paypal.com/v1/billing/plans/P-5ML4271244454362WXNWU5NQ",
        "rel": "edit",
        "method": "PATCH"
      }
    ],
    "id": "P-7GL4271244454362WXNWU5NQ",
    "status": "ACTIVE"
  },
  "links": [
    {
      "href": "https://api.paypal.com/v1/notifications/webhooks-events/WH-55TG7562XN2588878-8YH955435R661687G",
      "rel": "self",
      "method": "GET",
      "encType": "application/json"
    },
    {
      "href": "https://api.paypal.com/v1/notifications/webhooks-events/WH-55TG7562XN2588878-8YH955435R661687G/resend",
      "rel": "resend",
      "method": "POST",
      "encType": "application/json"
    }
  ],
  "event_version": "1.0",
  "resource_version": "2.0"
}

WEBHOOK_CANCELLED = {
  "id": "WH-6TD369808N914414D-1YJ376786E892292F",
  "create_time": "2016-04-28T11:53:10Z",
  "resource_type": "Agreement",
  "event_type": "BILLING.SUBSCRIPTION.CANCELLED",
  "summary": "A billing subscription was cancelled",
  "resource": {
    "agreement_details": {
      "outstanding_balance": {
        "value": "0.00"
      },
      "num_cycles_remaining": "5",
      "num_cycles_completed": "0",
      "last_payment_date": "2016-04-28T11:29:54Z",
      "last_payment_amount": {
        "value": "1.00"
      },
      "final_payment_due_date": "2017-11-30T10:00:00Z",
      "failed_payment_count": "0"
    },
    "description": "update desc",
    "links": [
      {
        "href": "https://api.paypal.com/v1/payments/billing-agreements/I-PE7JWXKGVN0R",
        "rel": "self",
        "method": "GET"
      }
    ],
    "id": "I-PE7JWXKGVN0R",
    "shipping_address": {
      "recipient_name": "Cool Buyer",
      "line1": "3rd st",
      "line2": "cool",
      "city": "San Jose",
      "state": "CA",
      "postal_code": "95112",
      "country_code": "US"
    },
    "state": "Cancelled",
    "plan": {
      "curr_code": "USD",
      "links": [],
      "payment_definitions": [
        {
          "type": "TRIAL",
          "frequency": "Month",
          "frequency_interval": "1",
          "amount": {
            "value": "5.00"
          },
          "cycles": "5",
          "charge_models": [
            {
              "type": "TAX",
              "amount": {
                "value": "1.00"
              }
            },
            {
              "type": "SHIPPING",
              "amount": {
                "value": "1.00"
              }
            }
          ]
        },
        {
          "type": "REGULAR",
          "frequency": "Month",
          "frequency_interval": "1",
          "amount": {
            "value": "10.00"
          },
          "cycles": "15",
          "charge_models": [
            {
              "type": "TAX",
              "amount": {
                "value": "2.00"
              }
            },
            {
              "type": "SHIPPING",
              "amount": {
                "value": "1.00"
              }
            }
          ]
        }
      ],
      "merchant_preferences": {
        "setup_fee": {
          "value": "0.00"
        },
        "auto_bill_amount": "YES",
        "max_fail_attempts": "21"
      }
    },
    "payer": {
      "payment_method": "paypal",
      "status": "verified",
      "payer_info": {
        "email": "coolbuyer@example.com",
        "first_name": "Cool",
        "last_name": "Buyer",
        "payer_id": "XLHKRXRA4H7QY",
        "shipping_address": {
          "recipient_name": "Cool Buyer",
          "line1": "3rd st",
          "line2": "cool",
          "city": "San Jose",
          "state": "CA",
          "postal_code": "95112",
          "country_code": "US"
        }
      }
    },
    "start_date": "2016-04-30T07:00:00Z"
  },
  "links": [
    {
      "href": "https://api.paypal.com/v1/notifications/webhooks-events/WH-6TD369808N914414D-1YJ376786E892292F",
      "rel": "self",
      "method": "GET",
      "encType": "application/json"
    },
    {
      "href": "https://api.paypal.com/v1/notifications/webhooks-events/WH-6TD369808N914414D-1YJ376786E892292F/resend",
      "rel": "resend",
      "method": "POST",
      "encType": "application/json"
    }
  ],
  "event_version": "1.0"
}

WEBHOOK_RENEWED = {
  "id": "WH-77687562XN25889J8-8Y6T55435R66168T6",
  "create_time": "2018-19-12T22:20:32.000Z",
  "resource_type": "subscription",
  "event_type": "BILLING.SUBSCRIPTION.RENEWED",
  "summary": "A billing agreement was renewed.",
  "resource": {
    "quantity": "20",
    "subscriber": {
      "name": {
        "given_name": "John",
        "surname": "Doe"
      },
      "email_address": "customer@example.com",
      "shipping_address": {
        "name": {
          "full_name": "John Doe"
        },
        "address": {
          "address_line_1": "2211 N First Street",
          "address_line_2": "Building 17",
          "admin_area_2": "San Jose",
          "admin_area_1": "CA",
          "postal_code": "95131",
          "country_code": "US"
        }
      }
    },
    "create_time": "2018-12-10T21:20:49Z",
    "shipping_amount": {
      "currency_code": "USD",
      "value": "10.00"
    },
    "start_time": "2018-11-01T00:00:00Z",
    "update_time": "2018-12-10T21:20:49Z",
    "billing_info": {
      "outstanding_balance": {
        "currency_code": "USD",
        "value": "10.00"
      },
      "cycle_executions": [
        {
          "tenure_type": "TRIAL",
          "sequence": 1,
          "cycles_completed": 1,
          "cycles_remaining": 0,
          "current_pricing_scheme_version": 1
        },
        {
          "tenure_type": "REGULAR",
          "sequence": 2,
          "cycles_completed": 1,
          "cycles_remaining": 0,
          "current_pricing_scheme_version": 2
        }
      ],
      "last_payment": {
        "amount": {
          "currency_code": "USD",
          "value": "500.00"
        },
        "time": "2018-12-01T01:20:49Z"
      },
      "next_billing_time": "2019-01-01T00:20:49Z",
      "final_payment_time": "2020-01-01T00:20:49Z",
      "failed_payments_count": 2
    },
    "links": [
      {
        "href": "https://api.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G",
        "rel": "self",
        "method": "GET"
      },
      {
        "href": "https://api.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G",
        "rel": "edit",
        "method": "PATCH"
      },
      {
        "href": "https://api.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G/suspend",
        "rel": "suspend",
        "method": "POST"
      },
      {
        "href": "https://api.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G/cancel",
        "rel": "cancel",
        "method": "POST"
      },
      {
        "href": "https://api.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G/capture",
        "rel": "capture",
        "method": "POST"
      }
    ],
    "id": "I-BW452GLLEP1G",
    "plan_id": "P-5ML4271244454362WXNWU5NQ",
    "auto_renewal": True,
    "status": "ACTIVE",
    "status_update_time": "2018-12-10T21:20:49Z"
  },
  "links": [
    {
      "href": "https://api.paypal.com/v1/notifications/webhooks-events/WH-77687562XN25889J8-8Y6T55435R66168T6",
      "rel": "self",
      "method": "GET",
      "encType": "application/json"
    },
    {
      "href": "https://api.paypal.com/v1/notifications/webhooks-events/WH-77687562XN25889J8-8Y6T55435R66168T6/resend",
      "rel": "resend",
      "method": "POST",
      "encType": "application/json"
    }
  ],
  "event_version": "1.0",
  "resource_version": "2.0"
}
