const axios = require('axios');
const keys = require('../config/keys');

const payStackKey = keys.paystack.apiSecretKey;

// sends post request to paystack api
const PaymentHandler = async(id) => {
    try {
        const req = await axios.get(
          `https://api.paystack.co/transaction/${id}`,
          {
            headers: {
              Authorization: `Bearer ${payStackKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        return req.data;
      } catch (error) {
        const NetworkError = new Error('Error fetching from paystack', error.response ? error.response.data : error.message);
        NetworkError.code = 'NETWORK_ERROR'
        throw NetworkError
      }
      
}

const listBanks = async() => {
    try {
        const req = await axios.get(
          `https://api.paystack.co/bank?currency=NGN`,
          {
            headers: {
              Authorization: `Bearer ${payStackKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        /**
         * Response data type:
         * "data": [] - array of objects
         *    "name": "Abbey Mortgage Bank",
              "slug": "abbey-mortgage-bank",
              "code": "801",
              "longcode": "",
              "gateway": null,
              "pay_with_bank": false,
              "active": true,
         */
        return req.data;
      } catch (error) {
        const NetworkError = new Error('Error fetching banks from paystack', error.response ? error.response.data : error.message);
        NetworkError.code = 'NETWORK_ERROR'
        throw NetworkError
      }
      
}

const verifyCustomerBank = async(accountNumber, bankCode) => {
    try {
        const req = await axios.get(
          `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
          {
            headers: {
              Authorization: `Bearer ${payStackKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        /*
         Response data type: "data": {
          "account_number": "0001234567",
          "account_name": "Doe Jane Loren",
          "bank_id": 9
        }
        */
        return req.data;
      } catch (error) {
        const NetworkError = new Error('Error verifying bank details', error.response ? error.response.data : error.message);
        NetworkError.code = 'NETWORK_ERROR'
        throw NetworkError
      }
}

const createTransferRecipient = async(name, accountNumber, bankCode, currency = "NGN", type = "nuban") => {
  try {
    const req = await axios.post(
      `https://api.paystack.co/transferrecipient`,
      {
        type,
        name,
        account_number: accountNumber,
        bank_code: bankCode,
        currency
      },
      {
        headers: {
          Authorization: `Bearer ${payStackKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    /*
    Response data type: {
      "status": true,
      "message": "Transfer recipient created successfully",
      "data": {
        "active": true,
        "createdAt": "2020-05-13T13:59:07.741Z",
        "currency": "NGN",
        "domain": "test",
        "id": 6788170,
        "integration": 428626,
        "name": "John Doe",
        "recipient_code": "RCP_t0ya41mp35flk40",
        "type": "nuban",
        "updatedAt": "2020-05-13T13:59:07.741Z",
        "is_deleted": false,
        "details": {
          "authorization_code": null,
          "account_number": "0001234567",
          "account_name": null,
          "bank_code": "058",
          "bank_name": "Guaranty Trust Bank"
        }
      }
    }
    */
    return req.status && req.data;

  } catch (error) {
    const NetworkError = new Error('Error creating transfer recipient', error.response ? error.response.data : error.message);
    NetworkError.code = 'NETWORK_ERROR_RECIPIENT'
    throw NetworkError
  }
}

const initiateTransfer = async(amount, reference, recipientId) => {
    try {
        const req = await axios.post(
          `https://api.paystack.co/transfer`,
          {
            source: "balance", 
            amount: amount,
            reference,
            recipient: recipientId,
            reason: "The link hangout payout"
          },
          {
            headers: {
              Authorization: `Bearer ${payStackKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        /*
         Response type: {
          "status": true,
          "message": "Transfer has been queued",
          "data": {
            "reference": "your-unique-reference",
            "integration": 428626,
            "domain": "test",
            "amount": 37800,
            "currency": "NGN",
            "source": "balance",
            "reason": "Holiday Flexing",
            "recipient": 6788170,
            "status": "success",
            "transfer_code": "TRF_fiyxvgkh71e717b",
            "id": 23070321,
            "createdAt": "2020-05-13T14:22:49.687Z",
            "updatedAt": "2020-05-13T14:22:49.687Z"
          }
        }
        */
        return req.status && req.data;
      } catch (error) {
        const NetworkError = new Error('Error initiating transfer', error.response ? error.response.data : error.message);
        NetworkError.code = 'NETWORK_ERROR'
        throw NetworkError
      }
}

module.exports = {
  PaymentHandler,
  listBanks,
  verifyCustomerBank,
  createTransferRecipient,
  initiateTransfer
};