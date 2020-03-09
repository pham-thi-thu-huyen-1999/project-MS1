import DataHelper from '../../../helpers/DataHelper';

class UserTradingQuestion {
    mobiles: {provider: string, percent: number}[];
    motorVehicle?: {regNumber: string, percent: number};
    vehicleAttachments: any[];
    utility: {
        useHomeOffice: boolean,
        business: {
            rent: number,
            electricity: number,
            gas: number,
            water: number,
            landline: number,
            internet: number
        }
    }

    constructor(model: UserTradingQuestion) {
        if (!model)
            return;

        this.mobiles = model.mobiles;
        this.motorVehicle = model.motorVehicle;
        this.vehicleAttachments = model.vehicleAttachments && Array.isArray(model.vehicleAttachments) ? model.vehicleAttachments.map(attach => DataHelper.handleFileDataModel(attach)) : [];
        this.utility = model.utility;

        DataHelper.handleDataModelInput(this);
    }
}

Object.seal(UserTradingQuestion);
export default UserTradingQuestion;
