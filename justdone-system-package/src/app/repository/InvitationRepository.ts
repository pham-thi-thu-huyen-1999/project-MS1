import IInvitation from '../model/invitation/interfaces/IInvitation'; // eslint-disable-line
import InvitationSchema from '../dataAccess/schemas/InvitationSchema';
import BaseRepository from './base/BaseRepository';
import InvitationCreate from '../model/invitation/InvitationCreate'; // eslint-disable-line
import InvitationUpdate from '../model/invitation/InvitationUpdate'; // eslint-disable-line

class InvitationRepository extends BaseRepository<IInvitation> {
    constructor() {
        super(InvitationSchema);
    }

    async create(data: InvitationCreate): Promise<IInvitation> {
        return await super.create(data);
    }

    async update(_id: string, data: InvitationUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }
}

Object.seal(InvitationRepository);
export default InvitationRepository;
