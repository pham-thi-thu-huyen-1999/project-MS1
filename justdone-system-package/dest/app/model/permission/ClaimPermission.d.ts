import IPermission from './interfaces/IPermission';
declare class ClaimPermission {
    _id: string;
    product: number;
    claim: number;
    fromRole: number;
    toRole: number;
    constructor(model: IPermission);
    static parseArray(list: IPermission[]): ClaimPermission[];
}
export default ClaimPermission;
