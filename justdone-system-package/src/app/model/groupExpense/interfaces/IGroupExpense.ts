import IBaseModel from '../../common/interfaces/IBaseModel';

interface IGroupExpense extends IBaseModel {
    userId: any;
    parent: any;
    code: number;
    name: string;
    searchTerm: string;
    coas: any[];
    order: number;
}

export default IGroupExpense;
