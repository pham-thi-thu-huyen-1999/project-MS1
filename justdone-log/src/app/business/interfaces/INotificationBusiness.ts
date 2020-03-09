import IBaseBusiness from './base/IBaseBusiness';
import Notification from './../../model/notification/Notification'; // eslint-disable-line
import NotificationCreate from './../../model/notification/NotificationCreate'; // eslint-disable-line
import NotificationUpdate from './../../model/notification/NotificationUpdate'; // eslint-disable-line

interface INotificationBusiness extends IBaseBusiness<Notification> {
    getByUserId: (receiverId: string, page: number, limit: number) => Promise<Notification[]>;
    getCountByUserId: (receiverId: string) => Promise<Number>;
    getCountNoReadByUserId: (receiverId: string) => Promise<Number>;

    create: (data: NotificationCreate) => Promise<Notification>;
    createMultipleToReceiverIds: (receiverIds: string[], title: string, message: string) => Promise<Notification[]>;
    createMultipleToData: (data: NotificationCreate[]) => Promise<Notification[]>;
    update: (_id: string, data: NotificationUpdate) => Promise<Notification | null>;

    delete: (_id: string) => Promise<boolean>;
}

export default INotificationBusiness;
