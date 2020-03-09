import IInvitation from './interfaces/IInvitation'; // eslint-disable-line
import InvitationToken from './InvitationToken';

class InvitationCreate {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    userId: any;
    productId: any;
    sendAt: Date;
    token: InvitationToken;

    constructor(model: IInvitation) {
        if (!model)
            return;

        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.firstName + ' ' + model.lastName;
        this.email = model.email;
        this.userId = model.userId;
        this.productId = model.productId;
        this.token = model.token && new InvitationToken(model.token);
    }
}

Object.seal(InvitationCreate);
export default InvitationCreate;
