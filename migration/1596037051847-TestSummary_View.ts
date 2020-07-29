import {MigrationInterface, QueryRunner} from "typeorm";

export class TestSummaryView1596037051847 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE VIEW `TestSummary_View` AS " +
            "SELECT ts.testSummaryID, ta.testAttemptID, ts.withinTimeLimit, ts.numberCorrect " +
            ", ts.duration, ts.grade, ta.testTopic, ta.testLevel " +
            ", ts.createdBy, ts.createdDatetime, ts.modifiedBy, ts.modifiedDatetime, ts.isActive " +
            "FROM test_summary ts " +
            "JOIN test_attempt ta ON ta.testAttemptId = ts.testAttemptID");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP VIEW `TestSummary_View`");
    }

}
