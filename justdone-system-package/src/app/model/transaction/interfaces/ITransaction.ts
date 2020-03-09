import IBaseModel from '../../common/interfaces/IBaseModel';
import {BankType, CrunchType} from '../../common/CommonType';

interface ITransaction extends IBaseModel {
    amount: any;
    accountId: number;
    baseType: string;
    bankId: number;
    categoryType: string;
    categoryId: number;
    category: string;
    categorySource: string;
    description: any;
    date: string;
    highLevelCategoryId: number;
    isManual: boolean;
    isWarningDuplicate?: boolean;
    duplicateId?: string;
    merchant: any;
    postDate?: Date;
    runningBalance: any;
    status: string;
    transactionId: number;
    userId: any;
    type: BankType;
    typeCrunch: CrunchType;
    month: number;
    year: number;
    coaId: any;
    index?: number;
    conditions:any;
    manualTransaction?: boolean;
}

export default ITransaction;
