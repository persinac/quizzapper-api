import { NextFunction, Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import QuestionNotFoundException from "../exceptions/question/QuestionNotFoundException";
import HttpException from "../exceptions/HttpException";
import genericValidation from "../middleware/validations/genericValidation";
import { TestAttempt } from "../entities/TestAttempt";
import { TestResponse } from "../entities/TestResponse";
import TestResponseController from "./testResponse";
import ICreateTestResponse from "../structure/IOrderResponse";
import { TestSummary } from "../entities/TestSummary";
import TestSummaryController from "./testSummary";

class TestAttemptController {
    public path = "/test-attempt";
    public router = Router();
    private testAttemptRepository = getRepository(TestAttempt);

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getAllTestAttempts);
        this.router.get(`${this.path}/:id`, this.getTestAttemptById);
        this.router.post(this.path, genericValidation(TestAttempt), this.createTestAttempt);
        this.router.post(`${this.path}/submit`, this.saveTestAttempt);
    }

    private getAllTestAttempts = (request: Request, response: Response) => {
        this.testAttemptRepository.find()
            .then((testAttempts: TestAttempt[]) => {
                response.send(testAttempts);
            });
    };

    private getTestAttemptById = (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        this.testAttemptRepository.findOne(id)
            .then((result: TestAttempt) => {
                result ? response.send(result) : next(new QuestionNotFoundException(id));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private createTestAttempt = async (request: Request, response: Response) => {
        let iResponse: ICreateTestResponse = {};
        const data: TestAttempt = request.body;
        console.log(request.body);
        const newTest = this.testAttemptRepository.create(data);
        const result: TestAttempt = await this.testAttemptRepository.save(newTest);
        iResponse.testAttempt = result;
        // create testResponse(s) based off of test attempt
        const tr: TestResponseController = new TestResponseController();
        iResponse = await tr.createTestResponsesForNewTestAttempt(result, iResponse);
        response.send(iResponse);
    };

    private saveTestAttempt = async (request: Request, response: Response) => {
        let iResponse: ICreateTestResponse = {};
        const testAttemptData: TestAttempt = request.body.testAttempt;
        const testResponseData: TestResponse[] = request.body.testResponse;
        iResponse.testAttempt = await this.testAttemptRepository.save(testAttemptData);
        const tr: TestResponseController = new TestResponseController();
        iResponse = await tr.saveTestResponsesTestAttempt(testResponseData, iResponse);
        const ts: TestSummaryController = new TestSummaryController();
        ts.createTestSummary(iResponse.testAttempt, iResponse.testResponse);
        response.send(iResponse);
    };
}

export default TestAttemptController;