import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IUserBusiness from '../app/business/interfaces/IUserBusiness';

class UserController extends BaseController {
    private userBusiness: IUserBusiness = BusinessLoader.userBusiness;

    constructor() {
        super();

        this.get('/:_id', this.getUserById.bind(this));
        this.get('/access-token', this.getUserByToken.bind(this));
        this.get('/email', this.getUserByEmail.bind(this));
        this.post('/authenticate', this.authenticate.bind(this));
        this.post('/', this.createUser.bind(this));
        this.delete('/:_id', this.deleteUser.bind(this));
        this.post('/lastAccess/:_id', this.updateLastAccessUser.bind(this));
    }

    async getUserById(req): Promise<any> {
        return await this.userBusiness.get(req.params._id);
    }

    async getUserByToken(req): Promise<any> {
        return await this.userBusiness.getUserByToken(req.query.token);
    }

    async getUserByEmail(req): Promise<any> {
        return await this.userBusiness.getUserByEmail(req.query.email);
    }

    async authenticate(req): Promise<any> {
        return await this.userBusiness.authenticate(req.body.productCode, req.body.email, req.body.password);
    }

    async createUser(req): Promise<any> {
        return await this.userBusiness.create(req.body);
    }

    async deleteUser(req): Promise<any> {
        return await this.userBusiness.delete(req.params._id);
    }

    async updateLastAccessUser(req): Promise<any> {
        return await this.userBusiness.updateLastAccessUser(req.params._id);
    }
}

Object.seal(UserController);
export default UserController;
