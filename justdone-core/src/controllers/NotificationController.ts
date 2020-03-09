import BaseController from './base/BaseController';
import LogHelper from 'justdone-system-package/dest/helpers/LogHelper';

class NotificationController extends BaseController {
    constructor() {
        super();

        this.get('/', this.validatePagination(10), this.getByUserId.bind(this));
        this.get('/count', this.getCountByUserId.bind(this));
        this.get('/count-no-read', this.getCountNoReadByUserId.bind(this));

        this.post('/', this.create.bind(this));
        this.post('/create-multi', this.createMultiple.bind(this));

        this.put('/:_id', this.update.bind(this));

        this.delete('/:_id', this.deleleOneByOne.bind(this));
    }

    async getByUserId(req): Promise<any> {
        return await LogHelper.get(`/api/notification?receiverId=${req.query.receiverId}&page=${req.query.page}&limit=${req.query.limit}`);
    }

    async getCountByUserId(req): Promise<any> {
        return await LogHelper.get(`/api/notification/count?receiverId=${req.query.receiverId}`);
    }

    async getCountNoReadByUserId(req): Promise<any> {
        return await LogHelper.get(`/api/notification/count-no-read?receiverId=${req.query.receiverId}`);
    }

    async create(req): Promise<any> {
        return await LogHelper.post(`/api/notification`, req.body);
    }

    async createMultiple(req): Promise<any> {
        return await LogHelper.post(`/api/notification/create-multi`, req.body);
    }

    async update(req): Promise<any> {
        return await LogHelper.put(`/api/notification/${req.params._id}`, req.body);
    }

    async deleleOneByOne(req): Promise<any> {
        return await LogHelper.delete(`/api/notification/${req.params._id}`);
    }
}

Object.seal(NotificationController);
export default NotificationController;
