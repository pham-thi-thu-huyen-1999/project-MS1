import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import RouteLoader from './RouteLoader';
// import Project from '../config/Project';

class MiddlewareLoader {
    static get configuration() {
        let app = express();

        if (['Development', 'Cloud'].find(env => env === process.env.NODE_ENV))
            app.use(logger('dev'));

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(express.static(path.join(__dirname, '../../static')));
        app.use(express.static(path.join(__dirname, '../../upload')));
        app.use('/logs', express.static(path.join(__dirname, '../../logs')));

        app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            // let origin = <string>req.headers.origin;

            // for (let serverKey in Project.SERVER) {
            //     if (origin.endsWith(Project.SERVER[serverKey].DOMAIN)) {
            //         res.setHeader('Access-Control-Allow-Origin', origin);
            //         break;
            //     }
            // }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
            next();
        });

        app.use(new RouteLoader().getRouters());

        // catch 404 and forward to error handler
        app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(404);
            res.send({error: {message: 'Not Found API!'}});
        });

        // error handler
        app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error(err);
            res.status(500);
            res.send({error: {message: 'Occurred an error!'}});
        });

        return app;
    }
}

Object.seal(MiddlewareLoader);
export default MiddlewareLoader;
