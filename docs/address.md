# Address API Spec

## Create Address

Endpoint: POST /api/contacts/:idContact/addresses

Request Header:
- X-API-TOKEN: token

Request Body:

```json
{
    "street": "123 Anyplace St Unit 3a",
    "city": "Las Vegas",
    "province": "Nevada",
    "country": "United States",
    "postal_code": "23123"
}
```

Response Body (Success):

```json
{
    "data": {
        "id": 1,
        "street": "123 Anyplace St Unit 3a",
        "city": "Las Vegas",
        "province": "Nevada",
        "country": "United States",
        "postal_code": "23123"
    }
}
```

Response Body (Failed):

```json
{
    "errors": "Postal Code is required, ..."
}
```

## Get Address

Endpoint: GET /api/contacts/:idContact/addresses/:idAddress

Request Header:
- X-API-TOKEN: token

Response Body (Success):

```json
{
    "data": {
        "id": 1,
        "street": "123 Anyplace St Unit 3a",
        "city": "Las Vegas",
        "province": "Nevada",
        "country": "United States",
        "postal_code": "23123"
    }
}
```

Response Body (Failed):

```json
{
    "errors": "Address is not found, ..."
}
```

## Update Address

Endpoint: PUT /api/contacts/:idContact/addresses/:idAddress

Request Header:
- X-API-TOKEN: token

Request Body:

```json
{
    "street": "123 Anyplace St Unit 3a",
    "city": "Las Vegas",
    "province": "Nevada",
    "country": "United States",
    "postal_code": "23123"
}
```

Response Body (Success):

```json
{
    "data": {
        "id": 1,
        "street": "123 Anyplace St Unit 3a",
        "city": "Las Vegas",
        "province": "Nevada",
        "country": "United States",
        "postal_code": "23123"
    }
}
```

Response Body (Failed):

```json
{
    "errors": "Postal Code is required, ..."
}
```

## Remove Address

Endpoint: PUT /api/contacts/:idContact/addresses/:idAddress

Request Header:
- X-API-TOKEN: token

Response Body (Success):

```json
{
    "data": "OK"
}
```

Response Body (Failed):

```json
{
    "errors": "Address is not found, ..."
}
```

## List Address

Endpoint: GET /api/contacts/:idContact/addresses

Request Header:
- X-API-TOKEN: token

Response Body (Success):

```json
{
    "data": [
        {
            "id": 1,
            "street": "123 Anyplace St Unit 3a",
            "city": "Las Vegas",
            "province": "Nevada",
            "country": "United States",
            "postal_code": "23123"
        },
        {
            "id": 2,
            "street": "22 Emerson Court",
            "city": "Las Vegas",
            "province": "Nevada",
            "country": "United States",
            "postal_code": "23123"
        },
    ]
}
```

Response Body (Failed):

```json
{
    "errors": "Contact is not found, ..."
}
```