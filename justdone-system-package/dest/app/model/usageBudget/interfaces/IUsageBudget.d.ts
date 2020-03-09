import IBaseModel from '../../common/interfaces/IBaseModel';
interface IUsageBudget extends IBaseModel {
    userId: any;
    coaId: any;
    beginYear: number;
    percentUsage: number;
}
export default IUsageBudget;
