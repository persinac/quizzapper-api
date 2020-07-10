import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNumber, IsString, ValidateIf } from "class-validator";

@Entity("category")
export class Category {
    @PrimaryGeneratedColumn()
    public categoryID?: number;

    @Column()
    @IsString()
    public label: string;


    @Column()
    @IsNumber()
    public typeOfCategory: number;

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