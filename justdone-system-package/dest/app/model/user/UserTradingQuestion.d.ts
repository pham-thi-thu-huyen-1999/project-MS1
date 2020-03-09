declare class UserTradingQuestion {
    mobiles: {
        provider: string;
        percent: number;
    }[];
    motorVehicle?: {
        regNumber: string;
        percent: number;
    };
    vehicleAttachments: any[];
    utility: {
        useHomeOffice: boolean;
        business: {
            rent: number;
            electricity: number;
            gas: number;
            water: number;
            landline: number;
            internet: number;
        };
    };
    constructor(model: UserTradingQuestion);
}
export default UserTradingQuestion;
