import IMessage from '../model/message/interfaces/IMessage';
import BaseRepository from './base/BaseRepository';
import MessageCreate from '../model/message/MessageCreate';
import MessageUpdate from '../model/message/MessageUpdate';
declare class MessageRepository extends BaseRepository<IMessage> {
    constructor();
    create(data: MessageCreate): Promise<IMessage>;
    update(_id: string, data: MessageUpdate): Promise<boolean>;
}
export default MessageRepository;
