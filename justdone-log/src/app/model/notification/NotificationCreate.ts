import INotification from './interfaces/INotification'; // eslint-disable-line
import NotificationReceiver from './NotificationReceiver'; //eslint-disable-line
class NotificationCreate {
    receiverId: string;
    title: string;
    message: string;

    constructor(model: INotification) {
        if (!model)
            return;

        this.receiverId = model.receiverId;
        this.title = model.title;
        this.message = model.message;
    }

    static parseArray(list: INotification[]): NotificationCreate[] {
        return list && Array.isArray(list) ? list.map(item => new NotificationCreate(item)) : [];
    }
}

Object.seal(NotificationCreate);
export default NotificationCreate;
