import IBankLoginForm from '../model/bankLoginForm/interfaces/IBankLoginForm'; // eslint-disable-line
import BankLoginFormSchema from '../dataAccess/schemas/BankLoginForm';
import BaseRepository from './base/BaseRepository';

class BankLoginFormRepository extends BaseRepository<IBankLoginForm> {
    constructor() {
        super(BankLoginFormSchema);
    }
}

Object.seal(BankLoginFormRepository);
export default BankLoginFormRepository;
