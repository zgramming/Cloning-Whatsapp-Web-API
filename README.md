![Logo](github/background.jpg)

# Cloning Whatsapp Web API

REST API for Whatsapp Web API

## Tech Stack

**Server:** Express, Socket IO, Prisma

## Features

- [x] Login
- [x] Register
- [x] Private Message
- [x] Search user by phone number
- [x] Realtime Chat
- [x] Realtime indicator user is typing

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- PORT (Port app for listen)
- DATABASE_URL (Database URL)
- JWT_SECRECT_KEY (JWT Secret key)

## Installation

Install application with NPM

```bash
  npm install
  npm run prisma:build
  npm run dev
```

## API Reference

#### Login

```http
  POST /login
```

| Body       | Type     | Description |
| :--------- | :------- | :---------- |
| `phone`    | `string` |             |
| `password` | `string` |             |

```json
{
  "success": true,
  "message": "Login success",
  "data": {
    "id": "bcbef436-b8eb-4669-baa3-0ab1c43a7a26",
    "name": "Zeffry Reynando",
    "phone": "089517229249",
    "password": "$2b$10$2IkKyLBQ0W3eZTnsT/DKjexmdR/PzuY4X8bs85Jrim7eSRRDKYQRW",
    "avatar": "https://loremflickr.com/350/350",
    "status": "active",
    "created_at": "2023-04-03T14:23:39.078Z",
    "updated_at": "2023-04-03T14:23:39.078Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJJZCI6ImJjYmVmNDM2LWI4ZWItNDY2OS1iYWEzLTBhYjFjNDNhN2EyNiJ9LCJpYXQiOjE2ODA3NDExODgsImV4cCI6MTY4MDgyNzU4OH0.oFkKHBjCVD2WAZCVlbq9qmDxTv0CLZ2fwIB5OQ-bR2A"
}
```

#### User : Get All User

```http
  GET /user
```

| Params       | Type     | Description |
| :--------- | :------- | :---------- |

```json
{
  "message": "All users",
  "success": true,
  "data": [
    {
      "id": "bcbef436-b8eb-4669-baa3-0ab1c43a7a26",
      "name": "Zeffry Reynando",
      "phone": "089517229249",
      "password": "$2b$10$2IkKyLBQ0W3eZTnsT/DKjexmdR/PzuY4X8bs85Jrim7eSRRDKYQRW",
      "avatar": "https://loremflickr.com/350/350",
      "status": "active",
      "created_at": "2023-04-03T14:23:39.078Z",
      "updated_at": "2023-04-03T14:23:39.078Z"
    },
  ]
}
```

#### User : Get By ID

```http
  GET /user/:id
```

| Params       | Type     | Description |
| :--------- | :------- | :---------- |
| `id`     | `string` |             |


```json
{
  "message": "User",
  "success": true,
  "data": {
    "id": "bd07371a-1391-41b5-ab4d-0085bc4e852a",
    "name": "Nakia",
    "phone": "089111222331",
    "password": "$2b$10$j3w7Ah8Km.NKwx8FOwtngeNa3iLIzfGVQthBkbiQUVINF8v8dWde2",
    "avatar": "https://loremflickr.com/300/300",
    "status": "active",
    "created_at": "2023-04-03T14:43:53.745Z",
    "updated_at": "2023-04-03T14:43:53.745Z"
  }
}
```

#### User : Get By Phone

```http
  GET /user/phone/:phone
```

| Params       | Type     | Description |
| :--------- | :------- | :---------- |
| `phone`     | `string` |             |


```json
{
  "message": "User",
  "success": true,
  "data": {
    "id": "bd07371a-1391-41b5-ab4d-0085bc4e852a",
    "name": "Zeffry",
    "phone": "089111222331",
    "avatar": "https://loremflickr.com/300/300"
  },
  "group": {
    "id": "720783c4-f803-4739-8284-434bff82b9f4",
    "name": "Private Group bcbef436-b8eb-4669-baa3-0ab1c43a7a26_bd07371a-1391-41b5-ab4d-0085bc4e852a",
    "code": "PRIVATE_bcbef436-b8eb-4669-baa3-0ab1c43a7a26_bd07371a-1391-41b5-ab4d-0085bc4e852a",
    "type": "PRIVATE",
    "avatar": null,
    "last_msg": "3",
    "last_sender": "bcbef436-b8eb-4669-baa3-0ab1c43a7a26",
    "created_at": "2023-04-05T06:16:58.361Z",
    "updated_at": "2023-04-06T00:04:56.106Z"
  }
}
```

#### User : Create User

```http
  POST /user
```

| Body       | Type     | Description |
| :--------- | :------- | :---------- |
| `name`     | `string` |             |
| `phone`    | `string` |             |
| `password` | `string` |             |

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "dccd3c39-15ed-478a-a3ce-03e716fe5b85",
    "name": "Zeffry Reynando",
    "phone": "089111222335",
    "password": "$2b$10$X0zpZUc0lP2.kH81p1sL0ezoa3oXsI13.VViuK9QzBdrSBhjMbPjm",
    "avatar": null,
    "status": "active",
    "created_at": "2023-04-06T00:36:42.617Z",
    "updated_at": "2023-04-06T00:36:42.617Z"
  }
}
```

#### Group : Get By ID

```http
  GET /group/:id
```

| Params       | Type     | Description |
| :--------- | :------- | :---------- |
| `id`     | `string` |             |


```json
{
  "status": true,
  "message": "Group found successfully",
  "data": {
    "id": "720783c4-f803-4739-8284-434bff82b9f4",
    "name": "Private Group bcbef436-b8eb-4669-baa3-0ab1c43a7a26_bd07371a-1391-41b5-ab4d-0085bc4e852a",
    "code": "PRIVATE_bcbef436-b8eb-4669-baa3-0ab1c43a7a26_bd07371a-1391-41b5-ab4d-0085bc4e852a",
    "type": "PRIVATE",
    "avatar": null,
    "last_msg": "3",
    "last_sender": "bcbef436-b8eb-4669-baa3-0ab1c43a7a26",
    "created_at": "2023-04-05T06:16:58.361Z",
    "updated_at": "2023-04-06T00:04:56.106Z",
    "group_member": [
      {
        "user_id": "bcbef436-b8eb-4669-baa3-0ab1c43a7a26",
        "user": {
          "id": "bcbef436-b8eb-4669-baa3-0ab1c43a7a26",
          "name": "Zeffry Reynando",
          "phone": "089517229249",
          "avatar": "https://loremflickr.com/350/350"
        }
      },
      {
        "user_id": "bd07371a-1391-41b5-ab4d-0085bc4e852a",
        "user": {
          "id": "bd07371a-1391-41b5-ab4d-0085bc4e852a",
          "name": "Nakia",
          "phone": "089111222331",
          "avatar": "https://loremflickr.com/300/300"
        }
      }
    ],
    "messages": [
      {
        "id": "74e02a3c-eade-473a-acb5-dfdcf45e5dc2",
        "group_id": "720783c4-f803-4739-8284-434bff82b9f4",
        "from": "bcbef436-b8eb-4669-baa3-0ab1c43a7a26",
        "message": "123",
        "type": "TEXT",
        "created_at": "2023-04-05T06:17:04.798Z",
        "updated_at": "2023-04-05T06:17:04.798Z",
        "deleted_at": null,
        "deleted_by": null
      },
    ],
    "interlocutors": {
      "user_id": "bd07371a-1391-41b5-ab4d-0085bc4e852a",
      "user": {
        "id": "bd07371a-1391-41b5-ab4d-0085bc4e852a",
        "name": "Nakia",
        "phone": "089111222331",
        "avatar": "https://loremflickr.com/300/300"
      }
    }
  }
}
```

#### Group : My Group

```http
  GET /group/me
```

| Params       | Type     | Description |
| :--------- | :------- | :---------- |


```json
{
  "status": true,
  "message": "Groups found successfully",
  "data": [
    {
      "id": "06eab7b4-840c-4233-a482-716fcdccd05a",
      "name": "Private Group bcbef436-b8eb-4669-baa3-0ab1c43a7a26_d1354264-7d20-4d85-bda3-cf99505198a7",
      "code": "PRIVATE_bcbef436-b8eb-4669-baa3-0ab1c43a7a26_d1354264-7d20-4d85-bda3-cf99505198a7",
      "type": "PRIVATE",
      "avatar": null,
      "last_msg": "woi, maen la",
      "last_sender": "d1354264-7d20-4d85-bda3-cf99505198a7",
      "created_at": "2023-04-05T06:18:48.819Z",
      "updated_at": "2023-04-05T23:25:23.956Z",
      "group_member": [
        {
          "user_id": "d1354264-7d20-4d85-bda3-cf99505198a7",
          "user": {
            "id": "d1354264-7d20-4d85-bda3-cf99505198a7",
            "name": "Syarif",
            "phone": "089111222332",
            "avatar": null
          }
        }
      ],
      "interlocutors": {
        "id": "d1354264-7d20-4d85-bda3-cf99505198a7",
        "name": "Syarif",
        "phone": "089111222332",
        "avatar": null
      }
    },
    {
      "id": "720783c4-f803-4739-8284-434bff82b9f4",
      "name": "Private Group bcbef436-b8eb-4669-baa3-0ab1c43a7a26_bd07371a-1391-41b5-ab4d-0085bc4e852a",
      "code": "PRIVATE_bcbef436-b8eb-4669-baa3-0ab1c43a7a26_bd07371a-1391-41b5-ab4d-0085bc4e852a",
      "type": "PRIVATE",
      "avatar": null,
      "last_msg": "3",
      "last_sender": "bcbef436-b8eb-4669-baa3-0ab1c43a7a26",
      "created_at": "2023-04-05T06:16:58.361Z",
      "updated_at": "2023-04-06T00:04:56.106Z",
      "group_member": [
        {
          "user_id": "bd07371a-1391-41b5-ab4d-0085bc4e852a",
          "user": {
            "id": "bd07371a-1391-41b5-ab4d-0085bc4e852a",
            "name": "Nakia",
            "phone": "089111222331",
            "avatar": "https://loremflickr.com/300/300"
          }
        }
      ],
      "interlocutors": {
        "id": "bd07371a-1391-41b5-ab4d-0085bc4e852a",
        "name": "Nakia",
        "phone": "089111222331",
        "avatar": "https://loremflickr.com/300/300"
      }
    }
  ]
}
```

#### Message : Get By Group

```http
  GET /message/group/:groupId
```

| Params       | Type     | Description |
| :--------- | :------- | :---------- |
| `groupId`     | `string` |             |


```json
{
  "success": true,
  "message": "Messages",
  "data": [
    {
      "id": "564a9d05-2207-486b-bc30-f6cc223baccb",
      "group_id": "720783c4-f803-4739-8284-434bff82b9f4",
      "from": "bcbef436-b8eb-4669-baa3-0ab1c43a7a26",
      "message": "3",
      "type": "TEXT",
      "created_at": "2023-04-06T00:04:56.106Z",
      "updated_at": "2023-04-06T00:04:56.106Z",
      "deleted_at": null,
      "deleted_by": null
    },
  ]
}
```

#### Message : Create Message

```http
  POST /message
```

| Body       | Type     | Description |
| :--------- | :------- | :---------- |
| `message`     | `string` |             |
| `group_id`     | `string` |             |
| `type`     | `enum` | TEXT,IMAGE, VIDEO, AUDIO,FILE |


```json
{
  "success": true,
  "message": "Message created",
  "data": {
    "id": "b388fdb6-0c2c-41aa-ad9b-58228973cf1f",
    "group_id": "720783c4-f803-4739-8284-434bff82b9f4",
    "from": "bcbef436-b8eb-4669-baa3-0ab1c43a7a26",
    "message": "Lagi apa nich",
    "type": "TEXT",
    "created_at": "2023-04-06T00:49:36.126Z",
    "updated_at": "2023-04-06T00:49:36.126Z",
    "deleted_at": null,
    "deleted_by": null
  }
}
```

## Roadmap

- [ ] Group Chat
- [ ] Send media chat (Image, Video, File, Audio, etc...)
- [ ] Update Profile
- [ ] Emoji
- [ ] Setting Page
- [ ] Indicator message delivered, read, error

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Related

Here are some related projects

- [Cloning Whatsapp Web Version](https://github.com/zgramming/Cloning-Whatsapp-Web)

## Support

For support, email zeffry.reynando@gmail.com

## Authors

- [@zgramming](https://github.com/zgramming)
