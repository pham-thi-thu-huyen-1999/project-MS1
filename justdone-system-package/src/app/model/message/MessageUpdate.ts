import IMessage from '../../model/message/interfaces/IMessage'; // eslint-disable-line
import MessageGroupReceive from '../../model/message/MessageGroupReceive';
import DataHelper from '../../../helpers/DataHelper';

class MessageUpdate {
    userId: string;
    content: string;
    groupReceive: MessageGroupReceive;
    fileId: string;

    constructor(model: MessageUpdate) {
        if (!model)
            return;

        this.userId = DataHelper.handleIdDataModel(model.userId);
        this.content = model.content;
        this.fileId = DataHelper.handleIdDataModel(model.fileId);
    }
}

Object.seal(MessageUpdate);
export default MessageUpdate;
