# DashGo-server

## Sobre o projeto:

- DashGo é uma aplicação desenvolvida durante o curso ignite da rocketseat. Porém durante o curso apenas desenvolvemos o front end. Este projeto vem para suprir a falta de uma API.

## Sobre a API:

- Esta api tem o intuito de fazer o CRUD de usuários.

## Ferramentas utilizadas:

- NodeJs, Express, Prisma

## Passos iniciais 
  
-  Após baixar o repositório utilize um `yarn add` para fazer o download de todas as dependências.
-  Após isto crie um arquivo .env conforme o exemplo.
-  Crie uma migration do banco de dados utilizando `prisma migrate dev --name init`.
-  Inicie o projeto com o comando `yarn dev`.

## Rotas da api:

## Rotas públicas:

| Rota    | Método | Descrição |
|---------|--------|-----------|
| /signIn | POST   | Login     |

## Rotas privadas:

### USUÁRIO

| Rota                  | Método | Descrição                        |
|-----------------------|--------|----------------------------------|
| /user                 | POST   | Cadastrar usuário                |
| /user?id              | PUT    | Editar usuário                   |
| /user/editPassword?id | PATCH  | Editar senha do usuário          |
| /user/all             | GET    | Pegar todos usuários             |
| /user/byId?id         | GET    | Pegar usuário pelo id            |
| /user/byEmail?email   | GET    | Pegar usuário pelo email         |
| /me                   | GET    | Pegar os dados do usuário logado |
| /user?id              | DEL    | Deletar usuário                  |

### CLIENTES

| Rota            | Método | Descrição             |
|-----------------|--------|-----------------------|
| /Client         | POST   | Cadastrar cliente     |
| /Client         | PUT    | Editar cliente        |
| /Client/All     | GET    | Pegar todos clientes  |
| /Client/byId?id | GET    | Pegar cliente pelo id |
| /Client?id      | DEL    | Deletar cliente       |

### PRODUTOS

| Rota             | Método | Descrição             |
|------------------|--------|-----------------------|
| /Product         | POST   | Cadastrar produto     |
| /Product?id      | PUT    | Editar produto        |
| /Product/all     | GET    | Pegar todos produtos  |
| /Product/byId?id | GET    | Pegar produto pelo id |
| /Product?id      | DEL    | Deletar produto       |

### ESTOQUE DE PRODUTO

| Rota           | Método | Descrição                           |
|----------------|--------|-------------------------------------|
| /Stock         | POST   | Cadastrar estoque de produto        |
| /Stock?id      | PUT    | Editar estoque de produto           |
| /Stock/all     | GET    | Pegar todos os estoques de produtos |
| /Stock/byId?id | GET    | Pegar estoque de produto pelo id    |

### COMPRAS

| Rota           | Método | Descrição                        |
|----------------|--------|----------------------------------|
| /Purchases     | POST   | Cadastra uma venda               |
| /Purchases/all | GET    | Pegar todas as compras           |

