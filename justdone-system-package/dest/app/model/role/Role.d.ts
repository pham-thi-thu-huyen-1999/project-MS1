import IRole from './interfaces/IRole';
declare class Role {
    _id: string;
    name: string;
    level: number;
    code: number;
    products: any[];
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: IRole);
    static parseArray(list: IRole[]): Role[];
}
export default Role;
