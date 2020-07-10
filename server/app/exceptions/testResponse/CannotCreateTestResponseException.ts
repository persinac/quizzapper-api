import HttpException from "../HttpException";

class CannotCreateTestResponseException extends HttpException {
    constructor(err: string) {
        super(404, `Cannot create test response! ${err}`);
    }
}

export default CannotCreateTestResponseException;