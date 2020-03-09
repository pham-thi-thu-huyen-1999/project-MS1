import IMessage from '../../model/message/interfaces/IMessage'; // eslint-disable-line
import MessageGroupReceive from '../../model/message/MessageGroupReceive';
import DataHelper from '../../../helpers/DataHelper';

class MessageCreate {
    userId: string;
    content: string;
    groupReceive: MessageGroupReceive;
    fileId: string;

    constructor(model: IMessage) {
        if (!model)
            return;

        this.userId = DataHelper.handleIdDataModel(model.userId);
        this.content = model.content;
        this.fileId = DataHelper.handleIdDataModel(model.fileId);
    }
}

Object.seal(MessageCreate);
export default MessageCreate;
