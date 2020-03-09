import IUser from './interfaces/IUser'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class UserChartAccountOpeningBalance {
    _id: string;
    dataCoaOpeningBalance: any[];
    month: number;
    year: number;

    constructor(model: UserChartAccountOpeningBalance) {
        if (!model)
            return;
        this._id = DataHelper.handleIdDataModel(model._id);
        this.dataCoaOpeningBalance = model.dataCoaOpeningBalance && Array.isArray(model.dataCoaOpeningBalance) ? model.dataCoaOpeningBalance.map(item => DataHelper.handleIdDataModel(item.coaId._id)) : [];
        this.month = model.month;
        this.year = model.year;
    }
}

Object.seal(UserChartAccountOpeningBalance);
export default UserChartAccountOpeningBalance;
