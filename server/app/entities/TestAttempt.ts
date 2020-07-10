import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNumber, IsString, ValidateIf } from "class-validator";

@Entity("test_attempt")
export class TestAttempt {
    @PrimaryGeneratedColumn()
    public testAttemptID?: number;

    @Column()
    @IsString()
    public testLevel: string;

    // tslint:disable-next-line:no-null-keyword
    @Column({ default: null, nullable: true })
    @IsString()
    @ValidateIf((o) => o.testTopic !== undefined)
    public testTopic?: string;

    @Column()
    @IsNumber()
    public numberOfQuestions: number;

    @Column()
    @IsNumber()
    public timeLimit: number;

    @Column()
    @IsNumber()
    public showHelperText: number;

    @Column()
    @IsNumber()
    public showDocumentation: number;

    // tslint:disable-next-line:no-null-keyword
    @Column({ default: null, nullable: true })
    public startDatetime?: Date;

    // tslint:disable-next-line:no-null-keyword
    @Column({ default: null, nullable: true })
    public endDatetime?: Date;

    // tslint:disable-next-line:no-null-keyword
    @Column({ default: null, nullable: true })
    public userSubmitted?: number;

    @Column()
    @IsString()
    public createdBy: string;

    // tslint:disable-next-line:no-null-keyword
    @Column({ default: null, nullable: true })
    public createdDatetime: Date;

    @Column()
    @IsString()
    public modifiedBy: string;

    // tslint:disable-next-line:no-null-keyword
    @Column({ default: null, nullable: true })
    public modifiedDatetime: Date;

    @Column()
    @IsNumber()
    public isActive: number;
}