<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://avatars.githubusercontent.com/u/51937952?s=400&u=191a298ccf06fb7a73b671936484d0718cb597ac&v=4" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Complete NestJS auth guide along with DB migrations, JWTs, authGuards, etc
    <p align="center">
<a href="https://github.com/ArpitSharma2800" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-ArpitSharma2800-blue.svg" alt="GitHub Profile" />
</a>
<a href="https://www.linkedin.com/in/arpit-sharma2800" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-arpit--sharma2800-green.svg" alt="LinkedIn Profile" />
</a>

</p>

## Installation

```bash
$ npm install
```

## NPM Packges

```bash
#TypeORM for database
$ npm install --save @nestjs/typeorm typeorm pg

#JWT token
$ npm install --save @nestjs/jwt
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running migrations for PG DB
```bash
# generate
$ npm run migration:generate -- ./db/migrations/<NAME>

# run the migration file
$ npm run migration:run

# revert the changes
$ npm run migration:revert
```

## APIs

### Login API

To login, make a POST request to the `/auth/login` endpoint with the user's email and password. Here's an example using curl:

Note* - JWT secret are supposed to encrypted for production use.

```bash
curl --location 'localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data '{
    "useremail":"your-email@example.com",
    "password":"your-password"
}'
```
### Get User by Email API

To get a user by email, make a GET request to the `/users/email/{email}` endpoint. Here's an example using curl:

```bash
curl --location --request GET 'localhost:3000/users/email/your-email@example.com' \
--header 'Content-Type: application/json' \
--data '{
    "isActive": true
}'
```

### Create User API

To create a user, make a POST request to the `/users` endpoint. Here's an example using curl:

```bash
curl --location 'localhost:3000/users' \
--header 'Content-Type: application/json' \
--data '{
    "userEmail": "your-email@example.com",
    "password": "your-password",
    "isActive": true
}'
```
