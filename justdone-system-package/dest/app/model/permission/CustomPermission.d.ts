import ICustomPermission from './interfaces/ICustomPermission';
declare class CustomPermission {
    claim: number;
    assigner: any;
    assignee: any;
    constructor(model: ICustomPermission);
    static parseArray(list: ICustomPermission[]): CustomPermission[];
}
export default CustomPermission;
