import ICrunchFilter from './interfaces/ICrunchFilter'; // eslint-disable-line

class CrunchCreate {
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
    // typeTransaction?:String;
    // categoryType?:String;
    // baseType?:String;

    constructor(model: ICrunchFilter) {
        if (!model)
            return;

        this.userId = model.userId;
        this.bankId = model.bankId;
        this.accountType = model.accountType;
        this.isGlobal = model.isGlobal;
        this.groupId = model.groupId;
        this.baseType = model.baseType;
        this.groupName = model.groupName;
        this.coaId = model.coaId;
        this.coaName = model.coaName;
        this.used = model.used;
        this.conditions = model.conditions;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
        // this.typeTransaction = model.typeTransaction;
        // this.categoryType = model.categoryType;
        // this.baseType = this.baseType;
    }
}

Object.seal(CrunchCreate);
export default CrunchCreate;
