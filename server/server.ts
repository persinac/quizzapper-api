require("dotenv").config({ path: "./environment-composers/.env" });

import App from "./app";
import QuestionController from "./app/controller/questions";
import "reflect-metadata";
import { createConnection } from "typeorm";
import config from "./ormconfig";
import CategoryController from "./app/controller/categories";
import TestResponseController from "./app/controller/testResponse";
import TestAttemptController from "./app/controller/testAttempt";
import TestSummaryController from "./app/controller/testSummary";



createConnection(config)
    .then((conn) => {
        const app = new App(
            [
                new QuestionController(),
                new CategoryController(),
                new TestResponseController(),
                new TestAttemptController(),
                new TestSummaryController()
            ],
            45761,
        );
        app.listen();
    })
    .catch((err) => {
        console.log("Error while connecting to the database", err);
        return err;
    });