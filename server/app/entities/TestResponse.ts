import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsNumber, IsString } from "class-validator";
import { Question } from "./Question";
import { TestAttempt } from "./TestAttempt";

@Entity("test_response")
export class TestResponse {
    @PrimaryGeneratedColumn()
    public responseID?: number;

    @Column()
    @IsNumber()
    public testAttemptID: number;

    @Column()
    @IsNumber()
    public questionID: number;

    // tslint:disable-next-line:no-null-keyword
    @Column({ default: null, nullable: true })
    @IsString()
    public response?: string;

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

    @ManyToMany(() => Question)
    @JoinColumn({
        name: "questionID",
        referencedColumnName: "questionID"
    })
    public question?: Question;
}