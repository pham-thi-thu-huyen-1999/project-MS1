import IBaseModel from '../../common/interfaces/IBaseModel';

interface IPermission extends IBaseModel {
    product: any;
    claim: number;
    fromRole: any;
    toRole?: any;
}

export default IPermission;
