import IBaseModel from '../../common/interfaces/IBaseModel';
import MessageGroupReceive from '../MessageGroupReceive';

interface IMessage extends IBaseModel {
    userId: string;
    content: string;
    groupReceive: MessageGroupReceive;
    fileId: string;
}

export default IMessage;
