import HttpException from "../HttpException";

class CannotCreateQuestionException extends HttpException {
    constructor(err: string) {
        super(404, `Cannot create question! ${err}`);
    }
}

export default CannotCreateQuestionException;