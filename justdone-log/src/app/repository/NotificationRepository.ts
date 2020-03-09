import INotification from '../model/notification/interfaces/INotification'; // eslint-disable-line
import NotificationSchema from '../dataAccess/schemas/NotificationSchema';
import BaseRepository from './base/BaseRepository';
import NotificationCreate from '../model/notification/NotificationCreate'; // eslint-disable-line
import NotificationUpdate from '../model/notification/NotificationUpdate'; // eslint-disable-line

class NotificationRepository extends BaseRepository<INotification> {
    constructor() {
        super(NotificationSchema);
    }

    async get(_id: string): Promise<INotification | null> {
        return await super.get(_id);
    }

    async create(data: NotificationCreate): Promise<INotification> {
        return await super.create(data);
    }

    async update(_id: string, data: NotificationUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }

    async delete(_id: string): Promise<boolean> {
        return await super.delete(_id);
    }
}

Object.seal(NotificationRepository);
export default NotificationRepository;
