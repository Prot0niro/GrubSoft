# Grubsoft

## Installation

Install [node](https://nodejs.org/en/download/).
Install and run [MongoDB](https://www.mongodb.com/download-center).

On poject root run:

```
npm install
```

## Build

On project root run
```
npm start
```

Open http://localhost:8888/

## Flow

Register a user with POST:/register.
```json
{
	"username": "admin",
	"password": "admin",
	"name": "Administrador",
	"admin": true
}
```

Login with POST:/login and save the token from the answer.
```json
{
	"username": "admin",
	"password": "admin"
}
```

Create a category using POST:/service/categorias with a header x-access-token with the saved token value.
```json
{
	"nombre": "Categoria01",
	"descripcion": "Descripción"
}
```

Create as many items as you want with POST:/service/items.
```json
{
	"nombre": "Item01",
	"descripcion": "Descripción",
	"categoria": "-- CategoriaId --",
	"precio": 20
}
```

Browse the app in http://localhost:8888/

