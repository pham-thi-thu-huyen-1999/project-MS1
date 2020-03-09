import IInvitation from './interfaces/IInvitation';
import InvitationToken from './InvitationToken';
declare class InvitationCreate {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    userId: any;
    productId: any;
    sendAt: Date;
    token: InvitationToken;
    constructor(model: IInvitation);
}
export default InvitationCreate;
