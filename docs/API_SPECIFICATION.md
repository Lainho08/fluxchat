# Especificação da API REST

Base URL: `/api/v1`

## Autenticação (`/auth`)

### `POST /auth/register`
Cadastra um novo usuário registrado.
**Body:**
```json
{
  "email": "user@example.com",
  "username": "usuario123",
  "password": "password123",
  "interests": ["gaming", "tech"]
}
```

### `POST /auth/login`
Autentica usuário existente.
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### `POST /auth/guest`
Cria sessão anônima temporária (sem cadastro).
**Body:**
```json
{
  "username": "Guest_4021",
  "interests": ["music"]
}
```

## Usuários (`/users`)

### `GET /users/profile`
Retorna dados do perfil autenticado.
**Headers:** `Authorization: Bearer <token>`

### `PUT /users/profile`
Atualiza perfil e interesses do usuário.

## Interesses (`/interests`)

### `GET /interests`
Lista todos os interesses cadastrados na plataforma.

## Admin (`/admin`)

### `GET /admin/dashboard`
Retorna métricas em tempo real (usuários online, salas ativas, sessões e logs).
**Headers:** `Authorization: Bearer <admin-token>`
