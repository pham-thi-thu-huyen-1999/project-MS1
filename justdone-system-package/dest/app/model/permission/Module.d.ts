declare class Module {
    code: number;
    name: string;
    order: number;
    claim: any;
    constructor(model: Module);
    static parseArray(list: Module[]): Module[];
}
export default Module;
