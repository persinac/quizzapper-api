import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsNumber, IsString, ValidateIf } from "class-validator";
import { TestAttempt } from "./TestAttempt";

@Entity("test_summary")
export class TestSummary {
    @PrimaryGeneratedColumn()
    public testSummaryID?: number;

    @Column()
    public testAttemptID: number;

    @Column()
    @IsNumber()
    public withinTimeLimit: number;

    @Column({
        // tslint:disable-next-line:no-null-keyword
        default: null,
        nullable: true
    })
    @IsNumber()
    public numberCorrect: number;

    @Column()
    @IsNumber()
    public duration: number;

    @Column({
        type: "decimal",
        precision: 11,
        scale: 2,
        // tslint:disable-next-line:no-null-keyword
        default: null,
        nullable: true
    })
    @IsNumber()
    public grade?: number;

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

    @ManyToOne(() => TestAttempt)
    @JoinColumn({
        name: "testAttemptID",
        referencedColumnName: "testAttemptID"
    })
    public testAttempt?: TestAttempt;
}