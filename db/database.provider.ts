import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    entities: ['dist/src/**/*.entity{.ts,.js}'], // To get all the sata that has database schema's matching the regex
    migrations: [
        'dist/db/migrations/*.js'
    ],

}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource;