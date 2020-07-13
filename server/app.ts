import express from "express";
import * as bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";

const originsWhitelist = [
    "http://localhost:3000",      // this is my front-end url for development
    "http://localhost:45762",      // this is my front-end url for development
    "http://www.quizzapper.com",
    "http://quizzapper.com",
    "https://www.quizzapper.com",
    "https://quizzapper.com",
];
const corsOptions: CorsOptions = {
    origin: function(origin, callback) {
        const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        // tslint:disable-next-line:no-null-keyword
        callback(null, isWhitelisted);
    },
    credentials: true,
    allowedHeaders: ["Origin, Content-Type, X-Auth-Token"],
    methods: ["HEAD, GET, POST, PUT"]
};

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers, port: number) {
        this.app = express();
        this.port = port || 48614;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(cors(corsOptions));
        this.app.options("*", cors(corsOptions));
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use("/api/", controller.router);
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;