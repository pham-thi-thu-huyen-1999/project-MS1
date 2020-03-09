import IRole from './interfaces/IRole';
declare class RoleCreate {
    name: string;
    level: number;
    code: number;
    products: any[];
    constructor(model: IRole);
}
export default RoleCreate;
