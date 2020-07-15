import { Request, Response, Router, NextFunction } from "express";
import { getRepository } from "typeorm";
import HttpException from "../exceptions/HttpException";
import nonRequestOrderDetailValidation from "../middleware/validations/nonRequestOrderDetailValidation";
import { ValidationError } from "class-validator";
import CannotCreateTestResponseException from "../exceptions/testResponse/CannotCreateTestResponseException";
import { TestResponse } from "../entities/TestResponse";
import CannotFindTestResponseWithTestException
    from "../exceptions/testResponse/CannotFindTestResponseWithTestException";
import TestResponseNotFoundException from "../exceptions/testResponse/TestResponseNotFoundException";
import { TestAttempt } from "../entities/TestAttempt";
import ICreateTestResponse from "../structure/IOrderResponse";
import QuestionController from "./questions";
import ITestResponse from "../structure/TestResponse";
import { IPagination, ISort } from "../structure/QueryParams/IQueryParams";

class TestResponseController {
    public path = "/test-attempt/:attemptId/response";
    public router = Router();
    private testResponseRepository = getRepository(TestResponse);

    private readonly DEFAULT_PAGING: IPagination;
    private readonly DEFAULT_SORT: ISort;

    constructor() {
        this.initializeRoutes();
        this.DEFAULT_PAGING = {startIndex: 0, batchSize: 25};
        this.DEFAULT_SORT = {sortBy: "responseID", ascDesc: "ASC"};
    }

    public initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.getTestResponseById);
        this.router.post(`${this.path}`, this.getTestResponsesByTestAttemptId);
        this.router.post(this.path, this.createTestResponse);
    }

    private getTestResponseById = (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        this.testResponseRepository.findOne(id)
            .then((result: TestResponse) => {
                result ? response.send(result) : next(new TestResponseNotFoundException(id));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private getTestResponsesByTestAttemptId = (request: Request, response: Response, next: NextFunction) => {
        const attemptId = request.params.attemptId;
        const body = request.body;
        const pagination: IPagination = body.pagination !== undefined ? body.pagination : this.DEFAULT_PAGING;
        const sort: ISort = body.sort !== undefined ? body.sort[0] : this.DEFAULT_SORT;
        this.testResponseRepository
            .createQueryBuilder("tr")
            .where({
                testAttemptID: attemptId
            })
            .orderBy({
                    [`tr.${sort.sortBy}`]: sort.ascDesc.toUpperCase() === "ASC" ? "ASC" : "DESC"
                }
            )
            .take(pagination.batchSize)
            .skip(pagination.startIndex)
            .getMany()
            .then((result: TestResponse[]) => {
                result.length > 0 ? response.send(result) : next(new CannotFindTestResponseWithTestException(attemptId));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private createTestResponse = (request: Request, response: Response, next: NextFunction) => {
        const testResponse: TestResponse = request.body;
        if (testResponse.testAttemptID === undefined) {
            next(new CannotCreateTestResponseException("Missing Test Attempt ID"));
        } else {
            nonRequestOrderDetailValidation(TestResponse, testResponse)
                .then((vErrors) => {
                    if (vErrors.length > 0) {
                        response.send(
                            next(
                                new CannotCreateTestResponseException(
                                    vErrors.map((error: ValidationError) => Object.values(error.constraints)).join(", ")
                                )
                            )
                        );
                    } else {
                        const newTestResponse = this.testResponseRepository.create(testResponse);
                        this.testResponseRepository.save(newTestResponse)
                            .then((result: TestResponse) => {
                                response.send(result);
                            })
                            .catch((err) => {
                                next(new CannotCreateTestResponseException(err));
                            });
                    }
                });
        }
    };

    /* public methods? */
    /***
     * Better... but still not my favorite location
     *
     *  Can we plug this into a utility... maybe we'll create an actual class...
     ***/
    public createTestResponsesForNewTestAttempt = async (testAttempt: TestAttempt, currentICreateTestResponse: ICreateTestResponse): Promise<ICreateTestResponse> => {
        // get questions based off of testAttempt config
        const qc: QuestionController = new QuestionController();
        const questionIds: number[] = await qc.getQuestionsForNewTestAttempt(testAttempt);
        const listOfResponses: TestResponse[] = [];
        questionIds.forEach((v: number) => {
            listOfResponses.push({
                testAttemptID: testAttempt.testAttemptID,
                questionID: v,
                createdBy: testAttempt.createdBy,
                createdDatetime: new Date(),
                modifiedBy: testAttempt.modifiedBy,
                modifiedDatetime: new Date(),
                isActive: 1
            });
        });
        const newTestResponses = this.testResponseRepository.create(listOfResponses);
        try {
            const trResult = await this.testResponseRepository.save(newTestResponses);
            currentICreateTestResponse.testResponse = trResult;
        } catch (e) {
            // created a test attempt but response(s) has field value issues
            if (currentICreateTestResponse.error === undefined) {
                currentICreateTestResponse.error = `Test Response: ${e.message}`;
            } else {
                currentICreateTestResponse.error = currentICreateTestResponse.error.concat(
                    [currentICreateTestResponse.error, `Test Response: ${e.message}`].join(", ")
                );
            }
        }
        return currentICreateTestResponse;
    };

    public saveTestResponsesTestAttempt = async (testResponses: ITestResponse[], currentICreateTestResponse: ICreateTestResponse): Promise<ICreateTestResponse> => {
        try {
            currentICreateTestResponse.testResponse = await this.testResponseRepository.save(testResponses);
        } catch (e) {
            // created a test attempt but response(s) has field value issues
            if (currentICreateTestResponse.error === undefined) {
                currentICreateTestResponse.error = `Test Response: ${e.message}`;
            } else {
                currentICreateTestResponse.error = currentICreateTestResponse.error.concat(
                    [currentICreateTestResponse.error, `Test Response: ${e.message}`].join(", ")
                );
            }
        }
        return currentICreateTestResponse;
    };

    public getResponseById = async (responseId: number): Promise<ITestResponse> => {
        let response: ITestResponse;
        try {
            response = await this.testResponseRepository.findOne(responseId);
        } catch (e) {
            console.log(e);
        }
        return response;
    };
}

export default TestResponseController;