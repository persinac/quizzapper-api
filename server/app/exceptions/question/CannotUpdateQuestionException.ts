import HttpException from "../HttpException";

class CannotUpdateQuestionException extends HttpException {
    constructor(err: string) {
        super(404, `Cannot update question! ${err}`);
    }
}

export default CannotUpdateQuestionException;