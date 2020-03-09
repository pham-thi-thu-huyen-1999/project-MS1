import IBaseModel from '../../common/interfaces/IBaseModel';
interface ICustomPermission extends IBaseModel {
    claim: number;
    assigner: any;
    assignee?: any;
}
export default ICustomPermission;
