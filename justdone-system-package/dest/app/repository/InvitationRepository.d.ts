import IInvitation from '../model/invitation/interfaces/IInvitation';
import BaseRepository from './base/BaseRepository';
import InvitationCreate from '../model/invitation/InvitationCreate';
import InvitationUpdate from '../model/invitation/InvitationUpdate';
declare class InvitationRepository extends BaseRepository<IInvitation> {
    constructor();
    create(data: InvitationCreate): Promise<IInvitation>;
    update(_id: string, data: InvitationUpdate): Promise<boolean>;
}
export default InvitationRepository;
