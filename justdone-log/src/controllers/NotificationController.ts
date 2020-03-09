import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import INotificationBusiness from '../app/business/interfaces/INotificationBusiness';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';

class NotificationController extends BaseController {
    private notificationBusiness: INotificationBusiness = BusinessLoader.notificationBusiness;

    constructor() {
        super();

        this.get('/', this.validatePagination(10), this.getByUserId.bind(this));
        this.get('/count', this.getCountByUserId.bind(this));
        this.get('/count-no-read', this.getCountNoReadByUserId.bind(this));

        this.post('/', this.create.bind(this));
        this.post('/create-multi-receivers', this.createMultipleToReceiverIds.bind(this));
        this.post('/create-multi-data', this.createMultipleToData.bind(this));

        this.put('/:_id', this.update.bind(this));

        this.delete('/:_id', this.deleleOneByOne.bind(this));
    }

    async getByUserId(req): Promise<any> {
        if (!req[Authenticator.userKey])
            return;
        return await this.notificationBusiness.getByUserId(req[Authenticator.userKey]._id, req.query.page, req.query.limit);
    }

    async getCountByUserId(req): Promise<any> {
        if (!req[Authenticator.userKey])
            return;
        return await this.notificationBusiness.getCountByUserId(req[Authenticator.userKey]._id);
    }

    async getCountNoReadByUserId(req): Promise<any> {
        if (!req[Authenticator.userKey])
            return;
        return await this.notificationBusiness.getCountNoReadByUserId(req[Authenticator.userKey]._id);
    }

    async create(req): Promise<any> {
        return await this.notificationBusiness.create(req.body);
    }

    async createMultipleToReceiverIds(req): Promise<any> {
        return await this.notificationBusiness.createMultipleToReceiverIds(req.body.receiverIds, req.body.title, req.body.message);
    }

    async createMultipleToData(req): Promise<any> {
        return await this.notificationBusiness.createMultipleToData(req.body);
    }

    async update(req): Promise<any> {
        return await this.notificationBusiness.update(req.params._id, req.body);
    }

    async deleleOneByOne(req): Promise<any> {
        return await this.notificationBusiness.delete(req.params._id);
    }
}

Object.seal(NotificationController);
export default NotificationController;
