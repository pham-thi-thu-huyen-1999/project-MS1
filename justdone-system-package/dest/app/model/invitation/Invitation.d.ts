import IInvitation from './interfaces/IInvitation';
import InvitationToken from './InvitationToken';
declare class Invitation {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    userId: any;
    productId: any;
    sendAt: Date;
    token: InvitationToken;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: Invitation);
    static parseArray(list: IInvitation[]): Invitation[];
}
export default Invitation;
