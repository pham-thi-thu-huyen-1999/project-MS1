import IStatement from '../model/statement/interfaces/IStatement';
import BaseRepository from './base/BaseRepository';
declare class StatementRepository extends BaseRepository<IStatement> {
    constructor();
    updateNameField(): Promise<boolean>;
}
export default StatementRepository;
