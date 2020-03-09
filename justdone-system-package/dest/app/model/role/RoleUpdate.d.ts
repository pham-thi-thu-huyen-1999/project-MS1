import IRole from './interfaces/IRole';
declare class RoleUpdate {
    name: string;
    level: number;
    code: number;
    constructor(model: IRole);
}
export default RoleUpdate;
