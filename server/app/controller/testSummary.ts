import { NextFunction, Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import QuestionNotFoundException from "../exceptions/question/QuestionNotFoundException";
import HttpException from "../exceptions/HttpException";
import { TestAttempt } from "../entities/TestAttempt";
import { TestSummary } from "../entities/TestSummary";
import ITestResponse from "../structure/TestResponse";
import QuestionController from "./questions";
import { Question } from "../entities/Question";
import { TestAttemptDetailView } from "../entities/TestAttemptDetailView";
import TestResponseController from "./testResponse";
import IQuestion from "../structure/Question";
import { IPagination, ISort } from "../structure/QueryParams/IQueryParams";

class TestSummaryController {
    public path = "/test-summary";
    public router = Router();
    private testSummaryRepository = getRepository(TestSummary);
    private testSummaryDetailRepository = getRepository(TestAttemptDetailView);

    private readonly DEFAULT_PAGING: IPagination;
    private readonly DEFAULT_SORT: ISort;

    constructor() {
        this.initializeRoutes();
        this.DEFAULT_PAGING = {startIndex: 0, batchSize: 25};
        this.DEFAULT_SORT = {sortBy: "testSummaryID", ascDesc: "ASC"};
    }

    public initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.getTestSummaryById);
        this.router.get(`${this.path}/detail/response/:responseId`, this.getTestSummaryResponseAndQuestionByResponseId);
        this.router.post(`${this.path}/detail/:id`, this.getTestSummaryDetailById);
        this.router.post(this.path, this.getAllTestSummary);
        this.router.post(this.path, this.getTestSummaryByUsername);
    }

    private getAllTestSummary = (request: Request, response: Response) => {
        const body = request.body;
        const pagination: IPagination = body.pagination !== undefined ? body.pagination : this.DEFAULT_PAGING;
        const sort: ISort = body.sort !== undefined ? body.sort[0] : this.DEFAULT_SORT;
        this.testSummaryRepository
            .createQueryBuilder("ts")
            .orderBy({
                    [`ts.${sort.sortBy}`]: sort.ascDesc.toUpperCase() === "ASC" ? "ASC" : "DESC"
                }
            )
            .take(pagination.batchSize)
            .skip(pagination.startIndex)
            .getMany()
            .then((testAttempts: TestSummary[]) => {
                response.send(testAttempts);
            });
    };

    private getTestSummaryById = (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        this.testSummaryRepository.findOne(id)
            .then((result: TestSummary) => {
                result ? response.send(result) : next(new QuestionNotFoundException(id));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private getTestSummaryDetailById = (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const body = request.body;
        const pagination: IPagination = body.pagination !== undefined ? body.pagination : this.DEFAULT_PAGING;
        const sort: ISort = body.sort !== undefined ? body.sort[0] : this.DEFAULT_SORT;
        this.testSummaryDetailRepository
            .createQueryBuilder("tsd")
            .where(`tsd.testSummaryID = :taID`, { taID: request.params.id })
            .orderBy({
                    [`tsd.${sort.sortBy}`]: sort.ascDesc.toUpperCase() === "ASC" ? "ASC" : "DESC"
                }
            )
            .take(pagination.batchSize)
            .skip(pagination.startIndex)
            .getMany()
            .then((result: TestAttemptDetailView[]) => {
                result ? response.send(result) : next(new QuestionNotFoundException(id));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private getTestSummaryResponseAndQuestionByResponseId = async (request: Request, response: Response) => {
        const id = request.params.responseId;
        const tr: TestResponseController = new TestResponseController();
        const userResponse: ITestResponse = await tr.getResponseById(Number(id));
        const q: QuestionController = new QuestionController();
        const associatedQuestion: IQuestion = await q.getQuestionByQuestionId(Number(userResponse.questionID));
        response.send({
            testResponse: userResponse,
            question: associatedQuestion
        });
    };


    private getTestSummaryByTestAttemptId = (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        this.testSummaryRepository.findOne(id)
            .then((result: TestSummary) => {
                result ? response.send(result) : next(new QuestionNotFoundException(id));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private getTestSummaryByUsername = (request: Request, response: Response, next: NextFunction) => {
        const body = request.body;
        const pagination: IPagination = body.pagination !== undefined ? body.pagination : this.DEFAULT_PAGING;
        const sort: ISort = body.sort !== undefined ? body.sort[0] : this.DEFAULT_SORT;
        this.testSummaryRepository
            .createQueryBuilder("ts")
            .where(`ts.createdBy = :username`, { username: request.body.username })
            .orderBy({
                    [`ts.${sort.sortBy}`]: sort.ascDesc.toUpperCase() === "ASC" ? "ASC" : "DESC"
                }
            )
            .take(pagination.batchSize)
            .skip(pagination.startIndex)
            .getMany()
            .then((result: TestSummary[]) => {
                result ? response.send(result) : next(new QuestionNotFoundException(request.body.username));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    public createTestSummary = async (testAttempt: TestAttempt, testResponses: ITestResponse[]): Promise<void> => {
        try {
            const {testAttemptID, startDatetime, endDatetime, createdBy, modifiedBy, timeLimit} = testAttempt;

            const testStartTime = +new Date(startDatetime);
            const testEndTime = +new Date(endDatetime);
            // duration in seconds
            const duration: number = (testEndTime - testStartTime) / 1000;
            const qIds: number[] = [];
            testResponses.forEach((tr: ITestResponse) => qIds.push(tr.questionID));

            const q: QuestionController = new QuestionController();
            const questions = await q.getQuestionsById(qIds);
            // for sake of time, we'll validate / calculate grade here
            let numCorrect: number = 0;
            testResponses.forEach((tr: ITestResponse) => {
                const currQues: Question = questions.filter((q: Question) => q.questionID === tr.questionID)[0];
                const response: string = tr.response;
                const splitCorrectAnswer: string[] = currQues.correctAnswer.split(";").sort();
                if (!!response) {
                    if (response.length > 0) {
                        const splitResponses: string[] = response.split(";").sort();
                        const isSame = (splitCorrectAnswer.length == splitResponses.length) && splitCorrectAnswer.every((element, index) => {
                            return element === splitResponses[index];
                        });
                        numCorrect = isSame ? numCorrect + 1 : numCorrect;
                    }
                }
            });
            console.log(`${numCorrect} / ${questions.length}`);

            const testSummary: TestSummary = {
                testAttemptID: testAttemptID,
                withinTimeLimit: duration <= (timeLimit * 60) ? 1 : 0,
                duration: duration,
                grade: (numCorrect / questions.length),
                numberCorrect: numCorrect,
                createdBy: createdBy,
                createdDatetime: new Date(),
                modifiedBy: modifiedBy,
                modifiedDatetime: new Date(),
                isActive: 1
            };
            console.log(testSummary);
            const newTestSummary = this.testSummaryRepository.create(testSummary);
            const result = this.testSummaryRepository.save(newTestSummary);
            console.log(result);
        } catch (e) {
            console.log(e);
        }
    };

    // public saveTestSummary = (testResponses: ITestResponse[]): void => {
    //     try {
    //         currentICreateTestResponse.testResponse = await this.testResponseRepository.save(testResponses);
    //     } catch (e) {
    //         // created a test attempt but response(s) has field value issues
    //         if (currentICreateTestResponse.error === undefined) {
    //             currentICreateTestResponse.error = `Test Response: ${e.message}`;
    //         } else {
    //             currentICreateTestResponse.error = currentICreateTestResponse.error.concat(
    //                 [currentICreateTestResponse.error, `Test Response: ${e.message}`].join(", ")
    //             );
    //         }
    //     }
    // };
}

export default TestSummaryController;