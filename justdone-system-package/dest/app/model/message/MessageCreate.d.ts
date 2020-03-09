import IMessage from '../../model/message/interfaces/IMessage';
import MessageGroupReceive from '../../model/message/MessageGroupReceive';
declare class MessageCreate {
    userId: string;
    content: string;
    groupReceive: MessageGroupReceive;
    fileId: string;
    constructor(model: IMessage);
}
export default MessageCreate;
