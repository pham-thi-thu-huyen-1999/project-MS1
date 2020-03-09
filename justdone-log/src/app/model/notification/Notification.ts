import INotification from './interfaces/INotification'; // eslint-disable-line
import NotificationReceiver from '../notification/NotificationReceiver'; //eslint-disable-line

class Notification {
    _id: string;
    receiverId: string
    title: string;
    message: string;
    isRead: boolean;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: INotification) {
        if (!model)
            return;

        this._id = model._id && model._id.toString();
        this.receiverId = model.receiverId;
        this.title = model.title;
        this.message = model.message;
        this.isRead = model.isRead;

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: INotification[]): Notification[] {
        return list && Array.isArray(list) ? list.map(item => new Notification(item)) : [];
    }
}

Object.seal(Notification);
export default Notification;
