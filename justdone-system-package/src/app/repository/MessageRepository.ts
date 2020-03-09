import IMessage from '../model/message/interfaces/IMessage'; // eslint-disable-line
import MessageSchema from '../dataAccess/schemas/MessageSchema';
import BaseRepository from './base/BaseRepository';
import MessageCreate from '../model/message/MessageCreate'; // eslint-disable-line
import MessageUpdate from '../model/message/MessageUpdate'; // eslint-disable-line

class MessageRepository extends BaseRepository<IMessage> {
    constructor() {
        super(MessageSchema);
    }

    async create(data: MessageCreate): Promise<IMessage> {
        return await super.create(data);
    }

    async update(_id: string, data: MessageUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }
}

Object.seal(MessageRepository);
export default MessageRepository;
