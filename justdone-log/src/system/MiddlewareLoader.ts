import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import RouteLoader from './RouteLoader';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
// import Project from '../config/Project';

class MiddlewareLoader {
    static get configuration() {
        let app = express();

        if (process.env.NODE_ENV === 'Development')
            app.use(logger('dev'));

        app.use(bodyParser.json({limit: 1048576}));
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(express.static(path.join(__dirname, '../../upload')));

        app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            // let origin = <string>req.headers.origin;

            // if (origin) {
            //     for (let serverKey in Project.SERVER) {
            //         if (origin.endsWith(Project.SERVER[serverKey].DOMAIN)) {
            //             res.setHeader('Access-Control-Allow-Origin', origin);
            //             break;
            //         }
            //     }
            // }
            // else {
            //     console.log('---------------------------end');
            //     return res.end();
            // }
            // console.log('origin--------------------: ', origin);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');

            if (req.method === 'OPTIONS')
                return res.end();
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
            res.status(500);
            res.send({error: {message: 'Occurred an error!'}});
        });

        return app;
    }
}

Object.seal(MiddlewareLoader);
export default MiddlewareLoader;
