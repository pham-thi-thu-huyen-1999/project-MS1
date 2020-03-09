import IUser from './interfaces/IUser';
export declare class ClientLookup {
    _id: string;
    fullname: string;
    email: string;
    abn?: string;
    constructor(model: IUser);
    static parseArray(list: IUser[]): ClientLookup[];
}
export default ClientLookup;
