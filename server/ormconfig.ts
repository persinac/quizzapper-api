import { ConnectionOptions } from "typeorm";

// set via docker-compose
const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    ENV_TYPE
} = process.env;

const ormDBConfig: ConnectionOptions = {
    type: "mysql",
    host: DB_HOST,
    port: Number(DB_PORT) || 3306,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [
        __dirname + "/app/entities/*{.ts,.js}",
    ],
    synchronize: ENV_TYPE === "development",
    logging: true
};

export default ormDBConfig;