import IMessage from '../../model/message/interfaces/IMessage';
import MessageGroupReceive from '../../model/message/MessageGroupReceive';
declare class Message {
    _id: string;
    userId: string;
    content: string;
    groupReceive: MessageGroupReceive;
    fileId: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: IMessage);
    static parseArray(list: IMessage[]): Message[];
}
export default Message;
