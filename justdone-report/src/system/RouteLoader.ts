import * as express from 'express';
import HomeController from '../controllers/HomeController';
import AnalyticController from '../controllers/AnalyticController';
import ReportController from '../controllers/ReportController';
import SystemController from '../controllers/SystemController';
import UsageBudgetController from '../controllers/UsageBudgetController';
class RouteLoader {
    private app: express.Express = express();

    constructor() {
        this.app.use('/', new HomeController().getRouter());
        this.app.use('/api/analytic', new AnalyticController().getRouter());
        this.app.use('/api/report', new ReportController().getRouter());
        this.app.use('/api/usage-budget', new UsageBudgetController().getRouter());
        this.app.use('/api/system', new SystemController().getRouter());
    }

    getRouters() {
        return this.app;
    }
}

Object.seal(RouteLoader);
export default RouteLoader;
