import IPermission from './interfaces/IPermission';
declare class Permission {
    _id: string;
    product: number;
    claim: number;
    fromRole: number;
    toRole: number;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: IPermission);
    static parseArray(list: IPermission[]): Permission[];
}
export default Permission;
