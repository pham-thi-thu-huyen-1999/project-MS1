import * as mongoose from 'mongoose';
export default class DataHelper {
    static toObjectId(_id: string): mongoose.Types.ObjectId;
    static handleDataModelInput(dataInput: any): void;
    static handleIdDataModel(data: any): any;
    static handleFileDataModel(file: any): any;
    static handlePromiseRequest(promise: any): Promise<any>;
    static applyTemplate(template: any, ...params: any[]): any;
    static convertToCurrency(value: number, option: any): string;
    static convertStringToBoolean(val: string): boolean;
}
