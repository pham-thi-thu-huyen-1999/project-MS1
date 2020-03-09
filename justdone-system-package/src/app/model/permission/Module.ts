class Module {
    code: number;
    name: string;
    order: number;
    claim: any;

    constructor(model: Module) {
        if (!model)
            return;

        this.code = model.code;
        this.name = model.name;
        this.order = model.order;
        this.claim = model.claim;
    }

    static parseArray(list: Module[]): Module[] {
        return list && Array.isArray(list) ? list.map(item => new Module(item)) : [];
    }
}

Object.seal(Module);
export default Module;
