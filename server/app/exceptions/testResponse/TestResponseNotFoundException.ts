import HttpException from "../HttpException";

class TestResponseNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Test response with id ${id} not found`);
    }
}

export default TestResponseNotFoundException;