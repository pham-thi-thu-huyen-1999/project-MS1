import IHistory from '../../model/history/interfaces/IHistory'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class HistoryTarget {
    id: string;
    email: string;

    constructor(model: HistoryTarget) {
        if (!model)
            return;

        this.id = DataHelper.handleIdDataModel(model.id);
        this.email = model.email;
    }
}

Object.seal(HistoryTarget);
export default HistoryTarget;
