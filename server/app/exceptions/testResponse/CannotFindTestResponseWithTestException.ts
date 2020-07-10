import HttpException from "../HttpException";

class CannotFindTestResponseWithTestException extends HttpException {
    constructor(id: string) {
        super(404, `There are no test responses with test attempt ID: ${id}`);
    }
}

export default CannotFindTestResponseWithTestException;