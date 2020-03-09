import INotification from './interfaces/INotification'; // eslint-disable-line
import NotificationReceiver from './NotificationReceiver'; //eslint-disable-line

class NotificationUpdate {
    receiverId: string;
    title: string;
    message: string;
    isRead: boolean;

    constructor(model: INotification) {
        if (!model)
            return;

        this.receiverId = model.receiverId;
        this.title = model.title;
        this.message = model.message;
        this.isRead = model.isRead;
    }
}

Object.seal(NotificationUpdate);
export default NotificationUpdate;
