import Message from 'justdone-system-package/dest/app/model/message/Message'; // eslint-disable-line
import MessageCreate from 'justdone-system-package/dest/app/model/message/MessageCreate'; // eslint-disable-line

interface IMessageBusiness {
    getByGroup(originId: string, role: number, page: number, limit: number): Promise<Message[]>;
    getCountByGroup(originId: string, role: number): Promise<number>;
    create(originId: string, data: MessageCreate): Promise<MessageCreate>;
}

export default IMessageBusiness;
