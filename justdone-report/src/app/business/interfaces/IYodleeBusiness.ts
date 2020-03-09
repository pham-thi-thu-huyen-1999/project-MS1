import {Promise} from 'mongoose';

interface IYodleeBusiness {
    getBankAccounts: (userId: string, type: number) => Promise<any>;
}

export default IYodleeBusiness;
