import DataHelper from '../../../helpers/DataHelper';

class UserPersonalInfo {
    postalName?: string;
    tfnCode?: string;
    driverLicense?: any; // File id
    phone?: string;
    birthday?: Date;
    address?: string;
    culture?: string;
    currency?: string;

    constructor(model: UserPersonalInfo) {
        if (!model)
            return;

        this.postalName = model.postalName;
        this.tfnCode = model.tfnCode;
        this.driverLicense = DataHelper.handleFileDataModel(model.driverLicense);
        this.phone = model.phone;
        this.birthday = model.birthday;
        this.address = model.address;
        this.culture = model.culture;
        this.currency = model.currency;
    }
}

Object.seal(UserPersonalInfo);
export default UserPersonalInfo;
