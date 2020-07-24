import { NextFunction, Request, Response, Router } from "express";
import { Question } from "../entities/Question";
import { getRepository, OrderByCondition } from "typeorm";
import QuestionNotFoundException from "../exceptions/question/QuestionNotFoundException";
import HttpException from "../exceptions/HttpException";
import genericValidation from "../middleware/validations/genericValidation";
import { TestAttempt } from "../entities/TestAttempt";
import { TSMap } from "typescript-map";
import IQuestion from "../structure/Question";
import { IPagination, ISort } from "../structure/QueryParams/IQueryParams";
import { Pagination } from "../middleware/paging/pagination";
import { Sorting } from "../middleware/sorting/sorting";
import { QueryFilterParser } from "../middleware/filtering/queryFilterParser";

class QuestionController {
    public path = "/question";
    public router = Router();
    private questionRepository = getRepository(Question);

    private readonly DEFAULT_PAGING: IPagination;
    private readonly DEFAULT_SORT: ISort[];

    constructor() {
        this.initializeRoutes();
        this.DEFAULT_PAGING = {startIndex: 0, batchSize: 25};
        this.DEFAULT_SORT = [{sortBy: "question", ascDesc: "ASC"}, {sortBy: "difficulty", ascDesc: "DESC"}];
    }

    public initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.getQuestionById);
        this.router.post(this.path, this.getAllQuestions);
        this.router.post(`${this.path}/create`, genericValidation(Question), this.createQuestion);
        this.router.post(`${this.path}/update`, genericValidation(Question), this.createQuestion);
    }

    private getAllQuestions = (request: Request, response: Response) => {
        const { body } = request;
        const alias: string = "q";
        const pagination: IPagination = Pagination.getPaginationForQuery(body);
        const sort: TSMap<string, ("ASC" | "DESC")> = Sorting.getSortingForQuery(body, alias, this.DEFAULT_SORT);
        const filters = body.filters;
        let qRepo = this.questionRepository.createQueryBuilder(alias);

        if (filters !== undefined) {
            qRepo = QueryFilterParser.buildWhereClause(
                qRepo,
                filters,
                alias
            );
        }

        qRepo
            .orderBy(sort.toJSON())
            .take(pagination.batchSize)
            .skip(pagination.startIndex)
            .getManyAndCount()
            .then((value) => {
                response.send({
                    questions: value[0],
                    totalCount: value[1]
                });
            });
    };

    private getQuestionById = (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        this.questionRepository.findOne(id)
            .then((result: Question) => {
                result ? response.send(result) : next(new QuestionNotFoundException(id));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private createQuestion = async (request: Request, response: Response) => {
        const data: Question = request.body;
        const newOrder = this.questionRepository.create(data);
        const result: Question = await this.questionRepository.save(newOrder);
        response.send(result);
    };

    /* public methods? */
    /***
     * Better... but still not my favorite location
     *
     *  Can we plug this into a utility... maybe we'll create an actual class...
     ***/
    public getQuestionsForNewTestAttempt = async (testAttempt: TestAttempt): Promise<number[]> => {
        // get questions based off of testAttempt config
        let initQs: Question[] = [];
        if (!!testAttempt.testTopic) {
            initQs = await this.questionRepository
                .createQueryBuilder("q")
                .where(`q.testTopic = :topic`, {topic: testAttempt.testTopic})
                .getMany();
        } else {
            initQs = await this.questionRepository.find({ select: ["questionID"] });
        }
        const retQuestionIds: number[] = [];
        const numOfQuestions = initQs.length < testAttempt.numberOfQuestions ? initQs.length : testAttempt.numberOfQuestions;
        let idx: number = 0;
        const shuffledQs: Question[] = QuestionController.shuffleQuestions(initQs);

        while (idx < numOfQuestions) {
            retQuestionIds.push(shuffledQs[idx].questionID);
            idx++;
        }
        return retQuestionIds;
    };

    public getQuestionsById = async (questionIds: number[]): Promise<Question[]> => {
        // get questions based off of testAttempt config
        let initQs: Question[] = [];
        if (!!questionIds) {
            initQs = await this.questionRepository
                .createQueryBuilder("q")
                .where(`q.questionID IN (:...ids)`, { ids: questionIds })
                .getMany();
        }
        return initQs;
    };

    private static shuffleQuestions(questions: Question[]): Question[] {
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        return questions;
    }

    public getQuestionByQuestionId = async (questionId: number): Promise<IQuestion> => {
        let response: IQuestion;
        try {
            response = await this.questionRepository.findOne(questionId);
        } catch (e) {
            console.log(e);
        }
        return response;
    };
}

export default QuestionController;