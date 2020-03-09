import IPermission from "./interfaces/IPermission";
declare class PermissionUpdate {
    product: number;
    claim: number;
    fromRole: number;
    toRole: number;
    deletedAt?: any;
    constructor(model: IPermission);
}
export default PermissionUpdate;
