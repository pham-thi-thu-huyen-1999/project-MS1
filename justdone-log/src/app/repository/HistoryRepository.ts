import IHistory from '../model/history/interfaces/IHistory'; // eslint-disable-line
import HistorySchema from '../dataAccess/schemas/HistorySchema';
import BaseRepository from './base/BaseRepository';
import HistoryCreate from '../model/history/HistoryCreate'; // eslint-disable-line
import HistoryUpdate from '../model/history/HistoryUpdate'; // eslint-disable-line

class HistoryRepository extends BaseRepository<IHistory> {
    constructor() {
        super(HistorySchema);
    }

    async get(_id: string): Promise<IHistory | null> {
        return await super.get(_id);
    }

    async create(data: HistoryCreate): Promise<IHistory> {
        return await super.create(data);
    }

    async update(_id: string, data: HistoryUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }

    async delete(_id: string): Promise<boolean> {
        return await super.delete(_id);
    }
}

Object.seal(HistoryRepository);
export default HistoryRepository;
