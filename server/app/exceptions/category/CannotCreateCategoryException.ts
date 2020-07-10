import HttpException from "../HttpException";

class CannotCreateCategoryException extends HttpException {
    constructor(err: string) {
        super(404, `Cannot create category! ${err}`);
    }
}

export default CannotCreateCategoryException;