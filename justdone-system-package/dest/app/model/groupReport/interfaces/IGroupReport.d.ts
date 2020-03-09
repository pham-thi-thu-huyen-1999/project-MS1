import IBaseModel from '../../common/interfaces/IBaseModel';
interface IGroupReport extends IBaseModel {
    code: string;
    name: string;
    searchTerm: string;
    coas: any[];
    order: number;
    parentId?: any;
}
export default IGroupReport;
