import IInvitation from './interfaces/IInvitation'; // eslint-disable-line
import InvitationToken from './InvitationToken';
import DataHelper from '../../../helpers/DataHelper';

class Invitation {
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

    constructor(model: Invitation) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.fullName;
        this.email = model.email;
        this.userId = DataHelper.handleIdDataModel(model.userId);
        this.productId = DataHelper.handleIdDataModel(model.productId);
        this.sendAt = model.sendAt;
        this.token = model.token && new InvitationToken(model.token);

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IInvitation[]): Invitation[] {
        return list && Array.isArray(list) ? list.map(item => new Invitation(item)) : [];
    }
}

Object.seal(Invitation);
export default Invitation;
