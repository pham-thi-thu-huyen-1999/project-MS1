import * as express from 'express';
import UserController from '../controllers/UserController';
import RoleController from '../controllers/RoleController';
import ProductController from '../controllers/ProductController';
import PermissionController from '../controllers/PermissionController';
import SystemController from '../controllers/SystemController';

class RouteLoader {
    private app: express.Express = express();

    constructor() {
        this.app.use('/api/user', new UserController().getRouter());
        this.app.use('/api/role', new RoleController().getRouter());
        this.app.use('/api/product', new ProductController().getRouter());
        this.app.use('/api/permission', new PermissionController().getRouter());
        this.app.use('/api/system', new SystemController().getRouter());
    }

    getRouters() {
        return this.app;
    }
}

Object.seal(RouteLoader);
export default RouteLoader;
