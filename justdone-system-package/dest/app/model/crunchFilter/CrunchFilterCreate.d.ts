import ICrunchFilter from './interfaces/ICrunchFilter';
declare class CrunchCreate {
    userId: any;
    bankId?: number;
    accountType?: number;
    isGlobal: boolean;
    groupId: number;
    baseType: string;
    groupName: string;
    coaId: string;
    coaName: string;
    used: number;
    conditions: any[];
    createdAt?: Date;
    updatedAt?: Date;
    constructor(model: ICrunchFilter);
}
export default CrunchCreate;
