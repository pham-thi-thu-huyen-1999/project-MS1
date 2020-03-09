import INotificationBusiness from '../business/interfaces/INotificationBusiness'; // eslint-disable-line
import Notification from '../model/notification/Notification';
import NotificationCreate from '../model/notification/NotificationCreate'; // eslint-disable-line
import NotificationUpdate from '../model/notification/NotificationUpdate'; // eslint-disable-line
import NotificationRepository from '../repository/NotificationRepository';
import DataHelper from '../../helpers/DataHelper';
import {ErrorCommon} from '../model/common/Error';

class NotificationBusiness implements INotificationBusiness {
    private notificationRepository: NotificationRepository;

    constructor() {
        this.notificationRepository = new NotificationRepository();
    }

    async get(_id: string): Promise<Notification | null> {
        if (!_id)
            return null;

        let result = await this.notificationRepository.get(_id);
        return result && new Notification(result);
    }

    async getByUserId(receiverId: string, page: number, limit: number): Promise<Notification[]> {
        if (!receiverId)
            return [];

        let params = {
            query: {
                // receivers: {$elemMatch: {userId: DataHelper.toObjectId(receiverId)}}
                // 'receivers.userId': {$in: [DataHelper.toObjectId(receiverId)]}
                'receiverId': DataHelper.toObjectId(receiverId)
            }
        };
        let result = await this.notificationRepository.find(params, {createdAt: -1}, page, limit);

        // update isRead
        result.forEach(notifi => {
            if (!notifi.isRead)
                this.updateStatus(notifi._id);
        });

        return Notification.parseArray(result);
    }

    async getCountByUserId(receiverId: string): Promise<Number> {
        if (!receiverId)
            return 0;

        let params = {
            query: {
                // receivers: {$elemMatch: {userId: DataHelper.toObjectId(receiverId)}}
                'receiverId': DataHelper.toObjectId(receiverId)
            }
        };

        return await this.notificationRepository.getCount(params);
    }

    async getCountNoReadByUserId(receiverId: string): Promise<Number> {
        if (!receiverId)
            return 0;

        let params = {
            query: {
                // receivers: {$elemMatch: {userId: DataHelper.toObjectId(receiverId)}},
                'receiverId': DataHelper.toObjectId(receiverId),
                'isRead': false

            }
        };

        return await this.notificationRepository.getCount(params);
    }
    async create(data: NotificationCreate): Promise<Notification> {
        if (!data || !data.receiverId || !data.title || !data.message)
            throw new ErrorCommon(101, 'Notification');

        // data.receiverId = DataHelper.toObjectId(data.receiverId);

        let result = await this.notificationRepository.create(data);

        return result && new Notification(result);
    }

    async createMultipleToReceiverIds(receiverIds: string[], title: string, message: string): Promise<Notification[]> {
        if (!receiverIds.length || !title || !message)
            return [];

        let body: {receiverId: string, title: string, message: string}[] = [];
        receiverIds.forEach(receiverId => {
            let data = {
                receiverId,
                title,
                message,
            };
            body.push(data);
        });

        let result = await this.notificationRepository.createMultiple(body);
        return Notification.parseArray(result);
    }

    async createMultipleToData(data: NotificationCreate[]): Promise<Notification[]> {
        if (!data.length)
            return [];

        let result = await this.notificationRepository.createMultiple(data);
        return Notification.parseArray(result);
    }

    async update(_id: string, data: NotificationUpdate): Promise<Notification | null> {
        if (!_id || !data)
            return null;

        let params = {
            query: {
                _id: DataHelper.toObjectId(_id)
            }
        };
        let result = await this.notificationRepository.findOneAndUpdate(params, data);
        return result && new Notification(result);
    }

    async updateStatus(_id: string): Promise<boolean> {
        if (!_id)
            return false;

        return await this.notificationRepository.update(_id, <any>{isRead: true});
    }

    async delete(_id: string): Promise<boolean> {
        if (!_id)
            return false;

        return await this.notificationRepository.delete(_id);
    }
}

Object.seal(NotificationBusiness);
export default NotificationBusiness;
