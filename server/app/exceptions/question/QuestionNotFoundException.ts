import HttpException from "../HttpException";

class QuestionNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Question with id ${id} not found`);
    }
}

export default QuestionNotFoundException;