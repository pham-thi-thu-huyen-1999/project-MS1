import IInvitation from './interfaces/IInvitation';
declare class InvitationUpdate {
    sendAt: Date;
    constructor(model: IInvitation);
}
export default InvitationUpdate;
