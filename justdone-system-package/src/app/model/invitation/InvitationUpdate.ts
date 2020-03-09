import IInvitation from './interfaces/IInvitation'; // eslint-disable-line

class InvitationUpdate {
    sendAt: Date;

    constructor(model: IInvitation) {
        if (!model)
            return;

        this.sendAt = model.sendAt;
    }
}

Object.seal(InvitationUpdate);
export default InvitationUpdate;
