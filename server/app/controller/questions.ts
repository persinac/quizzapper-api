import { NextFunction, Request, Response, Router } from "express";
import { Question } from "../entities/Question";
import { getRepository } from "typeorm";
import QuestionNotFoundException from "../exceptions/question/QuestionNotFoundException";
import HttpException from "../exceptions/HttpException";
import genericValidation from "../middleware/validations/genericValidation";
import { TestAttempt } from "../entities/TestAttempt";
import ICreateTestResponse from "../structure/IOrderResponse";
import ITestResponse from "../structure/TestResponse";
import IQuestion from "../structure/Question";

class QuestionController {
    public path = "/question";
    public router = Router();
    private questionRepository = getRepository(Question);

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getAllQuestions);
        this.router.get(`${this.path}/:id`, this.getQuestionById);
        this.router.post(`${this.path}/topic`, this.getQuestionByTopic);
        this.router.post(this.path, genericValidation(Question), this.createQuestion);
    }

    private getAllQuestions = (request: Request, response: Response) => {
        this.questionRepository.find()
            .then((questions: Question[]) => {
                response.send(questions);
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

    private getQuestionByTopic = (request: Request, response: Response, next: NextFunction) => {
        const t = request.body.topic;
        this.questionRepository
            .createQueryBuilder("q")
            .where(`q.testTopic = :topic`, {topic: t})
            .getMany()
            .then((result: Question[]) => {
                result ? response.send(result) : next(new QuestionNotFoundException(t));
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