import IBaseModel from '../../common/interfaces/IBaseModel';

interface IRole extends IBaseModel {
    name: string;
    level: number;
    code: number;
    products: any[];
}

export default IRole;
