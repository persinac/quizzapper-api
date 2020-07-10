import IQuestion from "./Question";
import IResponse from "./TestResponse";
import { ITestAttempt } from "./TestAttempt";
import ITestResponse from "./TestResponse";


interface ICreateTestResponse {
    testAttempt?: ITestAttempt;
    testResponse?: ITestResponse[];
    error?: string;
}

export default ICreateTestResponse;