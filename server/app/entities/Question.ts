import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsNumber, IsString, ValidateIf } from "class-validator";
import { TestResponse } from "./TestResponse";

@Entity("question")
export class Question {
    @PrimaryGeneratedColumn()
    public questionID?: number;

    @Column("varchar", {length: "1000"})
    @IsString()
    public question: string;

    @Column()
    @IsString()
    public style: string;

    @Column()
    @IsString()
    public testTopic: string;

    @Column()
    @IsString()
    public category: string;

    @Column()
    @IsString()
    public subCategory: string;

    @Column("varchar", {length: "1000"})
    @IsString()
    public correctAnswer: string;

    @Column("varchar", {length: "1000"})
    @IsString()
    public answers: string;

    @Column()
    @IsString()
    public difficulty: string;

    // tslint:disable-next-line:no-null-keyword
    @Column({ default: null, nullable: true })
    @IsString()
    @ValidateIf((o) => o.softwareVersion !== undefined && o.softwareVersion !== null)
    public softwareVersion?: string;

    // tslint:disable-next-line:no-null-keyword
    @Column({ default: null, nullable: true })
    @IsString()
    @ValidateIf((o) => o.documentation !== undefined)
    public documentation: string;

    // tslint:disable-next-line:no-null-keyword
    @Column("varchar", { length: "1000", default: null, nullable: true })
    @IsString()
    @ValidateIf((o) => o.helperTextOne !== undefined)
    public helperTextOne: string;

    // tslint:disable-next-line:no-null-keyword
    @Column("varchar", { length: "1000", default: null, nullable: true })
    @IsString()
    @ValidateIf((o) => o.helperTextTwo !== undefined)
    public helperTextTwo: string;

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
    @UpdateDateColumn()
    public modifiedDatetime: Date;

    @Column()
    @IsNumber()
    public isActive: number;

    @OneToMany(() => TestResponse, (res: TestResponse) => res.question)
    public responses: TestResponse[];
}