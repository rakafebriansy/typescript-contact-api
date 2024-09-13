# User API Spec

## Register User

Endpoint: POST /api/users

Request Body:

```json
{
    "username": "raka",
    "password": "12345",
    "name": "Raka Febrian"
}
```

Response Body (Success):

```json
{
    "data": {
        "username": "raka",
        "name": "Raka Febrian"
    }
}
```

Response Body (Failed):

```json
{
    "errors": "Username must not blank, ..."
}
```

## Login User

Endpoint: POST /api/users/login

Request Body:

```json
{
    "username": "raka",
    "password": "12345"
}
```

Response Body (Success):

```json
{
    "data": {
        "username": "raka",
        "name": "Raka Febrian",
        "token": "uuid"
    }
}
```

Response Body (Failed):

```json
{
    "errors": "Username or password are wrong, ..."
}
```

## Get User

Endpoint: GET /api/users/current

Request Header:
- X-API-TOKEN: token

Response Body (Success):

```json
{
    "data": {
        "username": "raka",
        "name": "Raka Febrian"
    }
}
```

Response Body (Failed):

```json
{
    "errors": "Unauthorized, ..."
}
```

## Update User

Endpoint: PATCH /api/users/current

Request Header:
- X-API-TOKEN: token

Request Body:

```json
{
    "password": "12345", //optional
    "name": "Raka Febrian" //optional
}
```

Response Body (Success):

```json
{
    "data": {
        "username": "raka",
        "name": "Raka Febrian"
    }
}
```

Response Body (Failed):

```json
{
    "errors": "Unauthorized, ..."
}
```

## Logout User

Endpoint: DELETE /api/users/current

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
    "errors": "Unauthorized, ..."
}
```