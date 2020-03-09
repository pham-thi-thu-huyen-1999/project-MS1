class Claim {
    code: number;
    name: string;
    path: string;
    method: string;
    order: number;

    constructor(model: Claim) {
        if (!model)
            return;

        this.code = model.code;
        this.name = model.name;
        this.path = model.path;
        this.method = model.method;
        this.order = model.order;
    }

    static parseArray(list: Claim[]): Claim[] {
        return list && Array.isArray(list) ? list.map(item => new Claim(item)) : [];
    }
}

Object.seal(Claim);
export default Claim;
