import IBaseModel from '../../common/interfaces/IBaseModel';
interface ICrunch extends IBaseModel {
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
}
export default ICrunch;
