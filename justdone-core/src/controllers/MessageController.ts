import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IMessageBusiness from '../app/business/interfaces/IMessageBusiness';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';

class MessageController extends BaseController {
    private messageBusiness: IMessageBusiness = BusinessLoader.messageBusiness;

    constructor() {
        super();

        this.get('/', Authenticator.isAuthenticated, this.validateData({field: 'role', type: 'NUM'}), this.validatePagination(10), this.getByGroup.bind(this));
        this.get('/count', Authenticator.isAuthenticated, this.validateData({field: 'role', type: 'NUM'}), this.getCountByGroup.bind(this));

        this.post('/', Authenticator.isAuthenticated, this.create.bind(this));
    }

    async getByGroup(req): Promise<any> {
        return await this.messageBusiness.getByGroup(req[Authenticator.userKey]._id, req.query.role, req.query.page, req.query.limit);
    }

    async getCountByGroup(req): Promise<any> {
        return await this.messageBusiness.getCountByGroup(req[Authenticator.userKey]._id, req.query.role);
    }

    async create(req): Promise<any> {
        return await this.messageBusiness.create(req[Authenticator.userKey]._id, req.body);
    }
}

Object.seal(MessageController);
export default MessageController;
