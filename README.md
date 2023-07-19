```sh
export DATABASE_URL="postgres://test-user@localhost:5432/test-db"
```
## How to test:
```sh
$ npm run test
```


## How to test manually:
```sh
$ ts-node src/index.ts | pino-pretty
$ curl "0.0.0.0:3000/locations?pageSize=3&chargerStatus=REMOVED" | jq
``

We're using the following libraries:
- queries: `@databases/pg`
- validation: `ajv`
- logging: `pino`


Databases are created for testing and are short-lived; to create one for dev investigstion, run `pg-test start` and `pg-test stop` (this will require `docker`)
