import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as multer from "multer";
import * as helmet from "helmet";
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import RouteLoader from './RouteLoader';
import LogHelper from 'justdone-system-package/dest/helpers/LogHelper';
import Project from '../config/Project';

class MiddlewareLoader {
    static get configuration() {
        let app = express();

        if (['Development', 'Cloud'].find(env => env === process.env.NODE_ENV))
            app.use(logger('dev'));

        app.use(bodyParser.json({limit: '5000mb'}));
        app.use(bodyParser.urlencoded({extended: true, limit: '5000mb'}));
        app.use(helmet()); 
        app.use(multer().single());
        app.use(express.static(path.join(__dirname, '../../upload')));
        app.use(express.static(path.join(__dirname, '../../static')));

        app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            // let origin = <string>req.headers.origin;

            // for (let serverKey in Project.SERVER) {
            //     if (origin.endsWith(Project.SERVER[serverKey].DOMAIN)) {
            //         res.setHeader('Access-Control-Allow-Origin', origin);
            //         break;
            //     }
            // }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'X-Product-Code, Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
            res.setHeader('Access-Control-Max-Age', 86400);

            if (req.method === 'OPTIONS')
                res.end();
            else
                next();
        });

        app.use(new Authenticator().getConfig());
        app.use(new RouteLoader().getRouters());

        // catch 404 and forward to error handler
        app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(404);
            res.send({error: {message: 'Not Found!'}});
        });

        // error handler
        app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error(err);
            LogHelper.logService.create({system: Project.PROJECT_NAME, module: null, method: req.method, path: req.originalUrl, description: 'Occurred an error!', status: 2});
            res.status(500);
            res.send({error: {message: 'Whoops, looks like something went wrong!'}});

            // res.send({error: {message: 'Occurred an error!'}});
            // LogHelper.writeLog(req, err.message);
        });

        return app;
    }
}

Object.seal(MiddlewareLoader);
export default MiddlewareLoader;
