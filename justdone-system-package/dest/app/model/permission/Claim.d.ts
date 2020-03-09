declare class Claim {
    code: number;
    name: string;
    path: string;
    method: string;
    order: number;
    constructor(model: Claim);
    static parseArray(list: Claim[]): Claim[];
}
export default Claim;
