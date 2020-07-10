import { Column } from "typeorm";
import { IsNumber, IsString } from "class-validator";

interface ITestResponse {
    responseID?: number;
    testAttemptID: number;
    questionID: number;
    response?: string;
    createdBy: string;
    createdDatetime: Date;
    modifiedBy: string;
    modifiedDatetime: Date;
    isActive: number;
}

export default ITestResponse;