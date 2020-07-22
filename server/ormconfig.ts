import { ConnectionOptions } from "typeorm";
import { join } from "path";

// set via docker-compose
const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    ENV_TYPE
} = process.env;

const config: ConnectionOptions = {
    type: "mysql",
    host: DB_HOST,
    port: Number(DB_PORT) || 3306,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [
        __dirname + "/app/entities/*{.ts,.js}",
    ],
    // synchronize: ENV_TYPE === "development",
    logging: true,
    migrationsTableName: "custom_migration_table",
    cli: {
        migrationsDir: "./migration"
    }
};

export = config;