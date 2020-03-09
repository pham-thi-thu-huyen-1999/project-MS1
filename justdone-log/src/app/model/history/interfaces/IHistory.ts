import IBaseModel from '../../common/interfaces/IBaseModel';
import HistoryTarget from '../HistoryTarget';

interface IHistory extends IBaseModel {
    userId: string;
    roleId?: string;
    productCode?: number;
    target?: HistoryTarget;
    claim: number;
    description: string;
    status: number;
}

export default IHistory;
