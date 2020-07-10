/**
 * env_config.
 *
 * Revisions to this file should not be committed to the repository.
 *
 * NOTE:
 * This will likely be deprecated with docker-compose setup
 */
const config = require("config");

export type MySQLConfig = {
    host: string,
    user: string,
    password: string,
    database: string
};

export let env_config: MySQLConfig = {
    host: process.env.NODE_ENV === "production" ? process.env.DOCKER_HOST_IP : config.get("host"),
    user: config.get("user"),
    password: config.get("password"),
    database: config.get("database")
};
