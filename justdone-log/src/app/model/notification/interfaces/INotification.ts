import IBaseModel from '../../common/interfaces/IBaseModel';

interface INotifiction extends IBaseModel {
    receiverId: string;
    title: string;
    message: string;
    isRead: boolean;
}

export default INotifiction;
