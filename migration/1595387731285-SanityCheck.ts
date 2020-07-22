import {MigrationInterface, QueryRunner} from "typeorm";

export class SanityCheck1595387731285 implements MigrationInterface {
    name = 'SanityCheck1595387731285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` CHANGE COLUMN `helperTextOne` `helperTextOne` VARCHAR(1000) NULL DEFAULT NULL");
        await queryRunner.query("ALTER TABLE `question` CHANGE COLUMN `helperTextTwo` `helperTextTwo` varchar(1000) NULL DEFAULT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` CHANGE COLUMN  `helperTextTwo` `helperTextTwo` varchar(2000) NULL");
        await queryRunner.query("ALTER TABLE `question` CHANGE COLUMN  `helperTextOne` `helperTextOne` varchar(2000) NULL");
    }

}
