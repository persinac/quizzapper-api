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
import { IPagination, ISort } from "../structure/QueryParams/IQueryParams";
import { Pagination } from "../middleware/paging/pagination";
import { TSMap } from "typescript-map";
import { Sorting } from "../middleware/sorting/sorting";

class TestAttemptController {
    public path = "/test-attempt";
    public router = Router();
    private testAttemptRepository = getRepository(TestAttempt);

    private readonly DEFAULT_PAGING: IPagination;
    private readonly DEFAULT_SORT: ISort[];

    constructor() {
        this.initializeRoutes();
        this.DEFAULT_PAGING = {startIndex: 0, batchSize: 25};
        this.DEFAULT_SORT = [{sortBy: "testAttemptID", ascDesc: "ASC"}];
    }

    public initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.getTestAttemptById);
        this.router.post(this.path, this.getAllTestAttempts);
        this.router.post(`${this.path}/new`, genericValidation(TestAttempt), this.createTestAttempt);
        this.router.post(`${this.path}/submit`, this.saveTestAttempt);
    }

    private getAllTestAttempts = (request: Request, response: Response) => {
        const { body } = request;
        const alias: string = "ta";
        const pagination: IPagination = Pagination.getPaginationForQuery(body);
        const sort: TSMap<string, ("ASC" | "DESC")> = Sorting.getSortingForQuery(body, alias, this.DEFAULT_SORT);

        this.testAttemptRepository
            .createQueryBuilder(alias)
            .orderBy(sort.toJSON())
            .take(pagination.batchSize)
            .skip(pagination.startIndex)
            .getMany()
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
        await ts.createTestSummary(iResponse.testAttempt, iResponse.testResponse);
        response.send(iResponse);
    };
}

export default TestAttemptController;