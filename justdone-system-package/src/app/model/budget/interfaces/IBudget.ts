import IBaseModel from '../../common/interfaces/IBaseModel';

interface IBudget extends IBaseModel {
    userId: string;
    year: any;
    month: number;
    coaId: any;
    amount: number;
}

export default IBudget;
