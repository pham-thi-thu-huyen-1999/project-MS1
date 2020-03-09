import IBaseModel from '../../common/interfaces/IBaseModel';
import InvitationToken from '../InvitationToken';

interface IInvitation extends IBaseModel {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    userId: any;
    productId: any;
    sendAt: Date;
    token: InvitationToken;
}

export default IInvitation;
