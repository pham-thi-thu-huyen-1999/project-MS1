import IBaseModel from '../../common/interfaces/IBaseModel';

interface ILog extends IBaseModel {
    system: string;
    module?: string;
    method: string;
    path?: string;
    description: string;
    status: number;
}

export default ILog;
