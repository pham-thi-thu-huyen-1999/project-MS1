import * as express from 'express';
import HomeController from '../controllers/HomeController';
import SystemController from '../controllers/SystemController';
import NotificationController from '../controllers/NotificationController';
import LogController from '../controllers/LogController';
import HistoryController from '../controllers/HistoryController';

class RouteLoader {
    private app: express.Express = express();

    constructor() {
        this.app.use('/api/', new HomeController().getRouter());
        this.app.use('/api/system', new SystemController().getRouter());
        this.app.use('/api/notification', new NotificationController().getRouter());
        this.app.use('/api/log', new LogController().getRouter());
        this.app.use('/api/history', new HistoryController().getRouter());
    }

    getRouters() {
        return this.app;
    }
}

Object.seal(RouteLoader);
export default RouteLoader;
