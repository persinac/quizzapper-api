import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
    name: "TestAttemptDetail_View",
    expression: `
        select ts.testSummaryID, ts.withinTimeLimit, ta.testAttemptID, tr.responseID, tr.response, q.questionID
        , q.answers, q.correctAnswer, q.difficulty, q.question
        from test_summary ts
        JOIN test_attempt ta ON ts.testAttemptID = ta.testAttemptID
        JOIN test_response tr ON ta.testAttemptID = tr.testAttemptID
        JOIN question q ON tr.questionID = q.questionID
    `
})
export class TestAttemptDetailView {

    @ViewColumn()
    testSummaryID: number;

    @ViewColumn()
    withinTimeLimit: number;

    @ViewColumn()
    testAttemptID: number;

    @ViewColumn()
    responseID: number;

    @ViewColumn()
    response: string;

    @ViewColumn()
    questionID: number;

    @ViewColumn()
    answers: string;

    @ViewColumn()
    correctAnswer: string;

    @ViewColumn()
    difficulty: string;

    @ViewColumn()
    question: string;

}