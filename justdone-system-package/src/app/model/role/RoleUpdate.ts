import IRole from './interfaces/IRole'; // eslint-disable-line

class RoleUpdate {
    name: string;
    level: number;
    code: number;
    // products: any[];

    constructor(model: IRole) {
        if (!model)
            return;

        this.name = model.name;
        this.level = model.level;
        this.code = model.code;
        // this.products = model.products;
    }
}

Object.seal(RoleUpdate);
export default RoleUpdate;
