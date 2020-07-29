import {
    PrimaryColumn,
    ViewColumn,
    ViewEntity
} from "typeorm";

@ViewEntity({
    name: "TestSummary_View",
    expression: `
        SELECT ts.testSummaryID, ta.testAttemptID, ts.withinTimeLimit, ts.numberCorrect
        , ts.duration, ts.grade, ta.testTopic, ta.testLevel
        , ts.createdBy, ts.createdDatetime, ts.modifiedBy, ts.modifiedDatetime, ts.isActive
        FROM test_summary ts
        JOIN test_attempt ta ON ta.testAttemptId = ts.testAttemptID;
    `
})
export class TestSummaryView {
    @PrimaryColumn()
    public testSummaryID?: number;

    @ViewColumn()
    public testAttemptID: number;

    @ViewColumn()
    public withinTimeLimit: number;

    @ViewColumn()
    public numberCorrect: number;

    @ViewColumn()
    public duration: number;

    @ViewColumn()
    public grade?: number;

    @ViewColumn()
    public testLevel: string;

    @ViewColumn()
    public testTopic?: string;

    @ViewColumn()
    public createdBy: string;

    @ViewColumn()
    public createdDatetime: Date;

    @ViewColumn()
    public modifiedBy: string;

    @ViewColumn()
    public modifiedDatetime: Date;

    @ViewColumn()
    public isActive: number;
}