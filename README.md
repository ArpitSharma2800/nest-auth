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


## Data migration

1. Kafka
2. Elastic Search (ES)
3. Kafka Connectors
4. Debezium Source connector (io.debezium.connector.postgresql.PostgresConnector)
5. Kibana
6. Elastic Search connector
7. Docker (Local deployment will also work)

### Installation

1. Run docker compose to start up. (Add pvt ip in the docker-compose.yaml)
2. Install Debezium and ES sink connectors.<br>
    a. https://www.confluent.io/hub/confluentinc/kafka-connect-elasticsearch
    ```bash
      #start Kafka connect in executable mode
      confluent-hub install confluentinc/ kafka-connect-elasticsearch:14.0.10
    ```
    b. https://www.confluent.io/hub/debezium/debezium-connector-postgresql
    ```bash
      #start Kafka connect in executable mode
    confluent-hub install debezium/debezium-connector-postgresql:2.2.1
    ```
    Restart kafka connect
  3. Enable Auto Topic creation Kafka.<br>
      Edit server.properties file and add.
      ```bash
      auto.create.topics.enable=true
      ```

### Create sink connector
Elastic Search Sink Connector

It can be created using kafka connect UI or through cURL

Through Properties / UI
``` bash
connector.class=io.debezium.connector.postgresql.PostgresConnector
database.user=postgres
database.dbname=postgres
slot.name=quniuq1
tasks.max=1
transforms=ExtractId,unwrap
transforms.ExtractId.field=userID
connector.class=io.confluent.connect.elasticsearch.ElasticsearchSinkConnector
type.name=_doc
behavior.on.null.values=delete
tasks.max=1
key.ignore=false
topics.regex=topic_2800.public.user
flush.synchronously=true
schema.ignore=true
key.converter.schemas.enable=false
value.converter.schemas.enable=false
connection.url=http://192.168.1.2:9200/
value.converter=org.apache.kafka.connect.json.JsonConverter
key.converter=org.apache.kafka.connect.storage.StringConverter
schemas.enable=false
```
Through cURL
``` bash
curl -X PUT \
  /api/kafka-connect-1/connectors/ElasticsearchSinkConnector/config \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
  "connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector",
  "type.name": "_doc",
  "behavior.on.null.values": "delete",
  "tasks.max": "1",
  "key.ignore": "false",
  "topics.regex": "topic_2800.public.user",
  "flush.synchronously": "true",
  "schema.ignore": "true",
  "key.converter.schemas.enable": "false",
  "value.converter.schemas.enable": "false",
  "connection.url": "http://192.168.1.2:9200/",
  "value.converter": "org.apache.kafka.connect.json.JsonConverter",
  "key.converter": "org.apache.kafka.connect.storage.StringConverter",
  "schemas.enable": "false"
}'
```

Important Information:
* key.ignore is set to false here because keys are meant to be taken from the database (userID). It is required for CRUD operations in Elasticsearch.
* key.converter is set to string for storing incoming keys from Kafka as strings to be set as document IDs.
* value.converter is converting incoming request values to JSON.
* To allow delete from CDC to flush data to ES
  ```
  behavior.on.null.values=delete
  ```
  This will delete the data, and key.ingore = false will allow data update.

### Creating source connector
Debezium source Connector
It is meant for transferring SMT(Single Message Transfer) messages, and it a change data capture (CDC).

It can be created using kafka connect UI or through cURL

Through Properties / UI
``` bash
connector.class=io.debezium.connector.postgresql.PostgresConnector
database.user=postgres
database.dbname=postgres
slot.name=quniuq1
tasks.max=1
transforms=ExtractId,unwrap
transforms.ExtractId.field=userID
database.port=5432
plugin.name=pgoutput
key.converter.schemas.enable=false
topic.prefix=topic_2800
database.hostname=postgres
database.password=postgres
transforms.unwrap.drop.tombstones=false
value.converter.schemas.enable=false
```

Through cURL
``` bash
curl -X PUT \
  /api/kafka-connect-1/connectors/PostgresConnector/config \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
  "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
  "database.user": "postgres",
  "database.dbname": "postgres",
  "slot.name": "quniuq1",
  "tasks.max": "1",
  "transforms": "ExtractId,unwrap",
  "transforms.ExtractId.field": "userID",
  "database.port": "5432",
  "plugin.name": "pgoutput",
  "key.converter.schemas.enable": "false",
  "topic.prefix": "topic_2800",
  "database.hostname": "postgres",
  "database.password": "postgres",
  "transforms.unwrap.drop.tombstones": "false",
  "value.converter.schemas.enable": "false",
  "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
  "table.include.list": "public.user",
  "value.converter": "org.apache.kafka.connect.json.JsonConverter",
  "key.converter": "org.apache.kafka.connect.json.JsonConverter",
  "transforms.ExtractId.type": "org.apache.kafka.connect.transforms.ExtractField$Key"
}'
```

Important information

* If this error occurs while flushing data to Elastic Seach
``` bash
org.apache.kafka.connect.errors.ConnectException: Indexing record failed -> Response status: 'BAD_REQUEST',
Index: 'topic_31.public.user',
 Document Id: '{"schema":{"type":"struct","fields":[{"type":"string","optional":false,"default":"","field":"userID"}],"optional":false,"name":"topic_31.public.user.Key"},"payload":{"userID":"f85a5c2d-647f-4ccf-927e-f6551101081f"}}'.
 ```
Problem : The key that is sent by Debezium connector on CDC is too long for to store as DocumentID.

``` bash
org.apache.kafka.connect.errors.ConnectException: Indexing record failed -> Response status: 'BAD_REQUEST',
Index: 'topic_32.public.users',
 Document Id: 'f85a5c2d-647f-4ccf-927e-f6551101081f'.
```
Problem : The key that is sent by Debezium connector on CDC is not in the correct format to store as DocumentID.

Solution to both the problems is to extract key from 
```
'{"schema":{"type":"struct","fields":[{"type":"string","optional":false,"default":"","field":"userID"}],"optional":false,"name":"topic_31.public.user.Key"},"payload":{"userID":"f85a5c2d-647f-4ccf-927e-f6551101081f"}}'.
```

For doing this, Kafka transformation are used, 

```
"key.converter": "org.apache.kafka.connect.json.JsonConverter",
"transforms": "ExtractId",
"transforms.ExtractId.type": "org.apache.kafka.connect.transforms.ExtractField$Key"
"transforms.ExtractId.field": "userID",
```

It will extract the Key from the above Key after converting it to JSON object.

* Now if the data is stored in the format like this:
```
{
	"op": "u",
	"source": {
		...
	},
	"ts_ms" : "...",
	"before" : {
		"field1" : "oldvalue1",
		"field2" : "oldvalue2"
	},
	"after" : {
		"field1" : "newvalue1",
		"field2" : "newvalue2"
	}
}
```
but is the data is required in the format like
```
{
	"field1" : "newvalue1",
	"field2" : "newvalue2"
}
```

Debezium New Record State Extraction will fix this problem:
https://debezium.io/documentation/reference/2.1/transformations/event-flattening.html
```
transforms=unwrap,...
transforms.unwrap.type=io.debezium.transforms.ExtractNewRecordState
transforms.unwrap.drop.tombstones=false
```

Stored Data will look something like this:
```
{
  "_index": "topic_2800.public.user",
  "_id": "\"462d93b7-74a2-4f38-9d6e-a0d9bf41ca4a\"",
  "_score": 1,
  "_source": {
    "Role": "admin",
    "password": "IwsEanjt",
    "updateDate": 1710085302440194,
    "salt": "XS1jMd0GWd0cI2GLNGCikQ==",
    "userEmail": "wi2w221",
    "keyDerivationInfo": "h6Bd5LZwD/FDCJSq4jLhiWBXwjis3/SvjL9IccouEs4=",
    "isActive": true,
    "userID": "462d93b7-74a2-4f38-9d6e-a0d9bf41ca4a",
    "iv": "rC8owX+hxVtB9eWJdkuHzQ==",
    "createDate": 1710085302440194
  }
},
```

## Index template policy
```
Work in progress
```

## Index Lifecycle Management
```
Work in progress
```