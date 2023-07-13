# API Documentation

This document provides information about the API endpoints.

## User Signup

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

Status Code: `400`

Response Body:
```json
{
  "error": "Mandatory fields are missing"
}
```
```json
{
  "error": "Phone Number should be of 10 digits"
}
```

Status Code: `409`

Response Body:
```json
{
  "error": "User already exists"
}
```

Status Code: `500`

Response Body:
```json
{
  "error": "An error occurred while processing the request"
}
```

## User Login

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

Status Code: `400`

Response Body:
```json
{
  "status": "Phone Number or Password missing"
}
```
```json
{
  "status": "Phone Number or token is incorrect"
}
```

Status Code: `500`

Response Body:
```json
{
  "error": "An error occurred while processing the request"
}
```

Note: The `access-token` returned in the response should be included in subsequent API requests as a bearer token in the `Authorization` header for authentication purposes.


## Add Rate List

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

Status Code: `400`

Response Body:
```json
{
  "error": "Mandatory fields are missing"
}
```
```json
{
  "error": "Rate List Already Exists"
}
```
```json
{
  "error": "Minimum FAT should be less than Maximum FAT"
}
```
```json
{
  "error": "Minimum FAT/SNF should be less than Maximum FAT/SNF"
}
```
```json
{
  "error": "Invalid Category"
}
```

Status Code: `401`

Response Body:
```json
{
  "error": "Unauthorized. Bearer token required."
}
```

Status Code: `500`

Response Body:
```json
{
  "error": "An error occurred while processing the request"
}
```

### Get All Rate Lists

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
    "maxSNF": 0.0,
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

Status Code: `401`

Response Body:
```json
{
  "error": "Unauthorized. Bearer token required."
}
```

Status Code: `500`

Response Body:
```json
{
  "error": "An error occurred while processing the request"
}
```

## Add Farmer

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

Status Code: `400`

Response Body:
```json
{
  "success": false,
  "message": "Missing required fields"
}
```
```json
{
  "status": "Farmer Already Exists"
}
```

Status Code: `401`

Response Body:
```json
{
  "error": "Unauthorized. Bearer token required."
}
```

Status Code: `500`

Response Body:
```json
{
  "error": "An error occurred while processing the request"
}
```

### Get All Farmers

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

Status Code: `401`

Response Body:
```json
{
  "error": "Unauthorized. Bearer token required."
}
```

Status Code: `500`

Response Body:
```json
{
  "error": "An error occurred while processing the request"
}
```
