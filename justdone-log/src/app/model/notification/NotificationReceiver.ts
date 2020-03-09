
class NotificationReceiver {
    userId: any;
    name: string;
    type: number

    constructor(model: NotificationReceiver) {
        if (!model)
            return;

        this.userId = model.userId;
        this.name = model.name;
        this.type = model && model.type ? model.type : 2;
    }

    static parseArray(list: NotificationReceiver[]): NotificationReceiver[] {
        return list && Array.isArray(list) ? list.map(item => new NotificationReceiver(item)) : [];
    }
}

Object.seal(NotificationReceiver);
export default NotificationReceiver;
