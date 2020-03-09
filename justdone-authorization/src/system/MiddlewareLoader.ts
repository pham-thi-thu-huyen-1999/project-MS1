import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import RouteLoader from './RouteLoader';
import LogHelper from 'justdone-system-package/dest/helpers/LogHelper';
import Project from '../config/Project';

class MiddlewareLoader {
    static get configuration() {
        let app = express();

        if (process.env.NODE_ENV === 'Development')
            app.use(logger('dev'));

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(express.static(path.join(__dirname, '../../upload')));
        app.use(express.static(path.join(__dirname, '../../public')));

        app.set('view engine', 'ejs');

        app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
            res.setHeader('Access-Control-Max-Age', 86400);

            if (req.method === 'OPTIONS')
                res.end();
            else
                next();
        });

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
        });

        return app;
    }
}

Object.seal(MiddlewareLoader);
export default MiddlewareLoader;
