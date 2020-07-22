import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedView1595452981969 implements MigrationInterface {
    name = 'UpdatedView1595452981969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM `quiz_app`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["quiz_app","TestAttemptDetail_View"]);
        await queryRunner.query("DROP VIEW `TestAttemptDetail_View`");
        await queryRunner.query("CREATE VIEW `TestAttemptDetail_View` AS " +
        "select concat(ts.testSummaryID, '-',ta.testAttemptID,'-',tr.responseID) as id " +
        ", ts.testSummaryID, ts.withinTimeLimit, ta.testAttemptID, tr.responseID, tr.response, q.questionID " +
        ", q.answers, q.correctAnswer, q.difficulty, q.question " +
        "from test_summary ts " +
        "JOIN test_attempt ta ON ts.testAttemptID = ta.testAttemptID " +
        "JOIN test_response tr ON ta.testAttemptID = tr.testAttemptID " +
        "JOIN question q ON tr.questionID = q.questionID");
        await queryRunner.query("INSERT INTO `quiz_app`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","quiz_app","TestAttemptDetail_View","select concat(ts.testSummaryID, '-',ta.testAttemptID,'-',tr.responseID) as id\n        , ts.testSummaryID, ts.withinTimeLimit, ta.testAttemptID, tr.responseID, tr.response, q.questionID\n        , q.answers, q.correctAnswer, q.difficulty, q.question\n        from test_summary ts\n        JOIN test_attempt ta ON ts.testAttemptID = ta.testAttemptID\n        JOIN test_response tr ON ta.testAttemptID = tr.testAttemptID\n        JOIN question q ON tr.questionID = q.questionID"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM `quiz_app`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["quiz_app","TestAttemptDetail_View"]);
        await queryRunner.query("DROP VIEW `TestAttemptDetail_View`");
        await queryRunner.query("CREATE VIEW `TestAttemptDetail_View` AS select ts.testSummaryID, ts.withinTimeLimit, ta.testAttemptID, tr.responseID, tr.response, q.questionID " +
        ", q.answers, q.correctAnswer, q.difficulty, q.question " +
        "from test_summary ts " +
        "JOIN test_attempt ta ON ts.testAttemptID = ta.testAttemptID " +
        "JOIN test_response tr ON ta.testAttemptID = tr.testAttemptID " +
        "JOIN question q ON tr.questionID = q.questionID");
        await queryRunner.query("INSERT INTO `quiz_app`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","quiz_app","TestAttemptDetail_View","select ts.testSummaryID, ts.withinTimeLimit, ta.testAttemptID, tr.responseID, tr.response, q.questionID\n        , q.answers, q.correctAnswer, q.difficulty, q.question\n        from test_summary ts\n        JOIN test_attempt ta ON ts.testAttemptID = ta.testAttemptID\n        JOIN test_response tr ON ta.testAttemptID = tr.testAttemptID\n        JOIN question q ON tr.questionID = q.questionID"]);
    }

}
