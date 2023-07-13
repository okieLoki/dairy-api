# API Documentation

This document provides information about the API endpoints.

## Table of Contents
- [User Signup](#user-signup)
- [User Login](#user-login)
- [Add Rate List](#add-rate-list)
- [Get All Rate Lists](#get-all-rate-lists)
- [Add Farmer](#add-farmer)
- [Get All Farmers](#get-all-farmers)
- [Add Collection](#add-collection)
- [Get All Collections](#get-all-collections)
- [Get All Dues](#get-all-dues)
- [Get Dues by Farmer ID](#get-dues-by-farmer-id)
- [Settle All Dues](#settle-all-dues)
- [Settle Farmer's Payment](#settle-farmers-payment)

## User Signup <a name="user-signup"></a>

Endpoint: `/api/user/signup`

Method: `POST`

#### Request Parameters

| Parameter | Type   | Required | Description            |
|-----------|--------|----------|------------------------|
| phoneNo   | string | Yes      | User's phone number    |
| name      | string | Yes      | User's name            |
| password  | string | Yes      | User's password        |

#### Response

##### Success Response

Status Code: `201`

Response Body:
```json
{
  "_id": "user-id",
  "phoneNo": "user-phoneNo",
  "name": "user-name",
  "token": "access-token"
}
```

##### Error Responses

| Status Code | Response Body                                    |
|-------------|-------------------------------------------------|
| 400         | {"error": "Mandatory fields are missing"}       |
| 400         | {"error": "Phone Number should be of 10 digits"}|
| 409         | {"error": "User already exists"}                |
| 500         | {"error": "An error occurred while processing the request"}|

## User Login <a name="user-login"></a>

Endpoint: `/api/user/login`

Method: `POST`

#### Request Parameters

| Parameter | Type   | Required | Description            |
|-----------|--------|----------|------------------------|
| phoneNo   | string | Yes      | User's phone number    |
| password  | string | Yes      | User's password        |

#### Response

##### Success Response

Status Code: `200`

Response Body:
```json
{
  "_id": "user-id",
  "phoneNo": "user-phoneNo",
  "name": "user-name",
  "token": "access-token"
}
```

##### Error Responses

| Status Code | Response Body                                    |
|-------------|-------------------------------------------------|
| 400         | {"status": "Phone Number or Password missing"}  |
| 400         | {"status": "Phone Number or token is incorrect"}|
| 500         | {"error": "An error occurred while processing the request"}|

Note: The access token returned in the response should be included in subsequent API requests as a bearer token in the `Authorization` header for authentication purposes.

## Add Rate List <a name="add-rate-list"></a>

Endpoint: `/api/ratelist`

Method: `POST`

Requires authentication. The request must include a valid bearer token in the `Authorization` header.

#### Request Parameters

| Parameter       | Type   | Required | Description                                             |
|-----------------|--------|----------|---------------------------------------------------------|
| category        | string | Yes      | Rate list category.                                     |
| level           | string | Yes      | Rate list level.                                        |
| rateChartName   | string | Yes      | Name of the rate chart.                                 |
| animal          | string | Yes      | Animal name.                                            |
| stdFat          | number |          | Standard fat value (for applicable categories).         |
| stdSNF          | number |          | Standard SNF value (for applicable categories).         |
| ratio           | number |          | Ratio value (for applicable categories).                |
| stdRate         | number | Yes      | Standard rate value.                                    |
| minFat          | number |          | Minimum fat value (for applicable categories).          |
| maxFat          | number |          | Maximum fat value (for applicable categories).          |
| fatIncrement    | number |          | Fat increment value (for applicable categories).        |
| minSNF          | number |          | Minimum SNF value (for applicable categories).          |
| maxSNF          | number |          | Maximum SNF value (for applicable categories).          |
| snfIncrement    | number |          | SNF increment value (for applicable categories).        |

Note: The required parameters depend on the selected category.

#### Response

##### Success Response

Status Code: `201`

Response Body:
```json
{
  "_id": "rate-list-id",
  "category": "rate-list-category",
  "level": "rate-list-level",
  "rateChartName": "rate-chart-name",
  "animal": "animal-name",
  "stdFat": 0.0,
  "stdSNF": 0.0,
  "ratio": 0.0,
  "stdRate": 0.0,
  "minFat": 0.0,
  "maxFat": 0.0,
  "fatIncrement": 0.0,
  "minSNF": 0.0,
  "maxSNF": 0.0,
  "snfIncrement": 0.0,
  "userId": "user-id"
}
```

##### Error Responses

| Status Code | Response Body                                    |
|-------------|-------------------------------------------------|
| 400         | {"error": "Mandatory fields are missing"}       |
| 400         | {"error": "Rate List Already Exists"}            |
| 400         | {"error": "Minimum FAT should be less than Maximum FAT"} |
| 400         | {"error": "Minimum FAT/SNF should be less than Maximum FAT/SNF"} |
| 400         | {"error": "Invalid Category"}                    |
| 401         | {"error": "Unauthorized. Bearer token required."} |
| 500         | {"error": "An error occurred while processing the request"} |

## Get All Rate Lists <a name="get-all-rate-lists"></a>

Endpoint: `/api/ratelist`

Method: `GET`

Requires authentication. The request must include a valid bearer token in the `Authorization` header.

#### Response

##### Success Response

Status Code: `200`

Response Body:
```json
[
  {
    "_id": "rate-list-id",
    "category": "rate-list-category",
    "level": "rate-list-level",
    "rateChartName": "rate-chart-name",
    "animal": "animal-name",
    "stdFat": 0.0,
    "stdSNF": 0.0,
    "ratio": 0.0,
    "stdRate": 0.0,
    "minFat": 0.0,
    "maxFat": 0.0,
    "fatIncrement": 0.0,
    "minSNF": 0.0,
    "maxSNF": 0.0

,
    "snfIncrement": 0.0,
    "userId": "user-id"
  },
  {
    "_id": "rate-list-id",
    "category": "rate-list-category",
    "level": "rate-list-level",
    "rateChartName": "rate-chart-name",
    "animal": "animal-name",
    "stdFat": 0.0,
    "stdSNF": 0.0,
    "ratio": 0.0,
    "stdRate": 0.0,
    "minFat": 0.0,
    "maxFat": 0.0,
    "fatIncrement": 0.0,
    "minSNF": 0.0,
    "maxSNF": 0.0,
    "snfIncrement": 0.0,
    "userId": "user-id"
  },
  ...
]
```

##### Error Response

| Status Code | Response Body                                    |
|-------------|-------------------------------------------------|
| 401         | {"error": "Unauthorized. Bearer token required."} |
| 500         | {"error": "An error occurred while processing the request"} |

## Add Farmer <a name="add-farmer"></a>

Endpoint: `/api/farmer`

Method: `POST`

Requires authentication. The request must include a valid bearer token in the `Authorization` header.

#### Request Parameters

| Parameter        | Type   | Required | Description                                             |
|------------------|--------|----------|---------------------------------------------------------|
| farmerId         | string | Yes      | Farmer ID.                                              |
| rfid             | string |          | RFID value.                                             |
| mobileNumber     | string | Yes      | Farmer's mobile number.                                 |
| farmerName       | string | Yes      | Farmer's name.                                          |
| farmerLevel      | string | Yes      | Farmer's level.                                         |
| paymentMode      | string | Yes      | Payment mode.                                           |
| bankName         | string |          | Name of the bank (if applicable).                        |
| accountNumber    | string |          | Bank account number (if applicable).                     |
| bankHolderName   | string |          | Bank account holder's name (if applicable).              |

#### Response

##### Success Response

Status Code: `201`

Response Body:
```json
{
  "_id": "farmer-id",
  "farmerId": "farmer-id",
  "rfid": "rfid-value",
  "mobileNumber": "mobile-number",
  "farmerName": "farmer-name",
  "farmerLevel": "farmer-level",
  "paymentMode": "payment-mode",
  "bankName": "bank-name",
  "accountNumber": "account-number",
  "bankHolderName": "bank-holder-name",
  "userId": "user-id"
}
```

##### Error Responses

| Status Code | Response Body                                    |
|-------------|-------------------------------------------------|
| 400         | {"success": false, "message": "Missing required fields"} |
| 400         | {"status": "Farmer Already Exists"}             |
| 401         | {"error": "Unauthorized. Bearer token required."} |
| 500         | {"error": "An error occurred while processing the request"} |

### Get All Farmers <a name="get-all-farmers"></a>

Endpoint: `/api/farmer`

Method: `GET`

Requires authentication. The request must include a valid bearer token in the `Authorization` header.

#### Response

##### Success Response

Status Code: `200`

Response Body:
```json
[
  {
    "_id": "farmer-id",
    "farmerId": "farmer-id",
    "rfid": "rfid-value",
    "mobileNumber": "mobile-number",
    .......
    "bankHolderName": "bank-holder-name",
    "userId": "user-id",
  },
  {
    "_id": "farmer-id",
    "farmerId": "farmer-id",
    "rfid": "rfid-value",
    "mobileNumber": "mobile-number",
    .....
    "bankHolderName": "bank-holder-name",
    "userId": "user-id",
  },
  ...
]
```

##### Error Response

| Status Code | Response Body                                    |
|-------------|-------------------------------------------------|
| 401         | {"error": "Unauthorized. Bearer token required."} |
| 500         | {"error": "An error occurred while processing the request"} |


## Add Collection <a name="add-collection"></a>

Endpoint: `/api/collection`

Method: `POST`

Requires authentication. The request must include a valid bearer token in the `Authorization` header.

### Request Parameters

| Parameter      | Type   | Required | Description                                |
|----------------|--------|----------|--------------------------------------------|
| farmerId       | string | Yes      | Farmer ID                                  |
| rateChartName  | string | Yes      | Name of the rate chart                     |
| qty            | number | Yes      | Quantity of collection                      |
| fat            | number | Yes      | Fat content of the collection              |
| snf            | number | Yes      | SNF (Solid-Not-Fat) content of the collection |

### Response

#### Success Response

Status Code: `201`

Response Body:
```json
{
  "_id": "collection-id",
  "farmerId": "farmer-id",
  "rateChartName": "rate-chart-name",
  "qty": 10,
  "fat": 4.5,
  "snf": 8.0,
  "rate": 36.5,
  "amount": 365.0,
  "userId": "user-id"
}
```

#### Error Responses

| Status Code | Response Body                                    |
|-------------|-------------------------------------------------|
| 400         | {"status": "Invalid Farmer ID or Rate Chart Name"} |
| 400         | {"status": "No rate list found with this name"} |
| 400         | {"status": "Invalid Rate Chart Category"} |
| 401         | {"error": "Unauthorized. Bearer token required."} |
| 500         | {"error": "An error occurred while processing the request"} |

## Get All Collections <a name="get-all-collections"></a>

Endpoint: `/api/collection`

Method: `GET`

Requires authentication. The request must include a valid bearer token in the `Authorization` header.

### Response

#### Success Response

Status Code: `200`

Response Body:
```json
[
  {
    "_id": "collection-id",
    "farmerId": "farmer-id",
    "rateChartName": "rate-chart-name",
    "qty": 10,
    "fat": 4.5,
    "snf": 8.0,
    "rate": 36.5,
    "amount": 365.0,
    "userId": "user-id"
  },
  {
    "_id": "collection-id",
    "farmerId": "farmer-id",
    "rateChartName": "rate-chart-name",
    "qty": 5,
    "fat": 3.5,
    "snf": 7.5,
    "rate": 32.5,
    "amount": 162.5

,
    "userId": "user-id"
  },
  ...
]
```

#### Error Response

| Status Code | Response Body                                    |
|-------------|-------------------------------------------------|
| 401         | {"error": "Unauthorized. Bearer token required."} |
| 500         | {"error": "An error occurred while processing the request"} |


## Get All Dues <a name="get-all-dues"></a>

Endpoint: `/api/dues`

Method: `GET`

Requires authentication. The request must include a valid bearer token in the `Authorization` header.

### Response

#### Success Response

Status Code: `200`

Response Body:
```json
[
  {
    "farmerId": "farmer-id",
    "farmerName": "farmer-name",
    "dues": 500.0
  },
  {
    "farmerId": "farmer-id",
    "farmerName": "farmer-name",
    "dues": 250.0
  },
  ...
]
```

#### Error Response

| Status Code | Response Body                                    |
|-------------|-------------------------------------------------|
| 401         | {"error": "Unauthorized. Bearer token required."} |
| 404         | {"message": "No farmer found"}                   |
| 400         | {"status": "Error"}                              |

## Get Dues by Farmer ID <a name="get-dues-by-farmer-id"></a>

Endpoint: `/api/dues/:farmerId`

Method: `GET`

Requires authentication. The request must include a valid bearer token in the `Authorization` header.

### Parameters

| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| farmerId  | string | Yes      | Farmer ID        |

### Response

#### Success Response

Status Code: `200`

Response Body:
```json
{
  "dues": 500.0
}
```

#### Error Responses

| Status Code | Response Body                                    |
|-------------|-------------------------------------------------|
| 401         | {"error": "Unauthorized. Bearer token required."} |
| 404         | {"message": "No farmer found"}                   |
| 400         | {"status": "Error"}                              |

## Settle All Dues <a name="settle-all-dues"></a>

Endpoint: `/api/dues/settle`

Method: `POST`

Requires authentication. The request must include a valid bearer token in the `Authorization` header.

### Response

#### Success Response

Status Code: `200`

Response Body:
```json
{
  "status": "Success"
}
```

#### Error Response

| Status Code | Response Body                                    |
|-------------|-------------------------------------------------|
| 401         | {"error": "Unauthorized. Bearer token required."} |
| 404         | {"message": "No farmer found"}                   |
| 400         | {"status": "Error"}                              |

Note: The `settle` endpoint will set the dues of all farmers to 0, indicating that all dues have been settled.


## Settle Farmer's Payment <a name="settle-farmers-payment"></a>

Endpoint: `/api/payment`

Method: `POST`

Requires authentication. The request must include a valid bearer token in the `Authorization` header.

### Request Parameters

| Parameter    | Type   | Required | Description                          |
|--------------|--------|----------|--------------------------------------|
| farmerId     | string | Yes      | Farmer ID                            |
| date         | string | Yes      | Payment date (format: YYYY-MM-DD)    |
| amountToPay  | number | Yes      | Amount to be paid                    |
| remarks      | string |          | Remarks or additional information    |

### Response

#### Success Response

Status Code: `200`

Response Body:
```json
{
  "status": "PAID",
  "date": "2023-07-15",
  "amount": 500.0,
  "amountPaid": 300.0,
  "remainingDues": 200.0,
  "remarks": "Payment received",
  "invoiceUrl": "https://example.com/invoice.pdf"
}
```

#### Error Response

| Status Code | Response Body                                    |
|-------------|-------------------------------------------------|
| 400         | {"status": "ERROR", "message": "Please provide all the details"} |
| 404         | {"message": "No farmer found"}                   |
| 400         | {"status": "ERROR", "message": "Amount to pay is greater than dues"} |
| 400         | {"status": "Error"}                              |

Note: The response will contain the payment details, including the payment status, date, amount, remaining dues, remarks, and the URL of the generated invoice in PDF format.