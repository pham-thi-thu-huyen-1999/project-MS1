import MessageGroupReceive from '../../model/message/MessageGroupReceive';
declare class MessageUpdate {
    userId: string;
    content: string;
    groupReceive: MessageGroupReceive;
    fileId: string;
    constructor(model: MessageUpdate);
}
export default MessageUpdate;
