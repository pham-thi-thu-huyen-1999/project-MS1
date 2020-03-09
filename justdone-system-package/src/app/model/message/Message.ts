import IMessage from '../../model/message/interfaces/IMessage'; // eslint-disable-line
import MessageGroupReceive from '../../model/message/MessageGroupReceive';
import DataHelper from '../../../helpers/DataHelper';

class Message {
    _id: string;
    userId: string;
    content: string;
    groupReceive: MessageGroupReceive;
    fileId: string;

    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: IMessage) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.userId = DataHelper.handleIdDataModel(model.userId);
        this.content = model.content;
        this.fileId = DataHelper.handleIdDataModel(model.fileId);
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IMessage[]): Message[] {
        return list && Array.isArray(list) ? list.map(item => new Message(item)) : [];
    }
}

Object.seal(Message);
export default Message;
