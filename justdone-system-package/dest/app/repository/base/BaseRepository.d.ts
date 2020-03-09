import * as mongoose from 'mongoose';
import IRead from '../interfaces/IRead';
import IWrite from '../interfaces/IWrite';
declare class BaseRepository<T extends mongoose.Document> implements IRead<T>, IWrite<T> {
    protected model: mongoose.Model<mongoose.Document>;
    constructor(schemaModel: mongoose.Model<mongoose.Document>);
    protected validateParam(param?: any): any;
    find(param?: any, order?: any, page?: number, limit?: number): Promise<T[]>;
    findAll(param?: any, order?: any): Promise<T[]>;
    findOne(param?: any): Promise<T | null>;
    getCount(param?: any): Promise<number>;
    get(_id: string, populate?: any): Promise<T | null>;
    aggregate(query: any): Promise<any[]>;
    create(data: object): Promise<T>;
    createMultiple(data: object[]): Promise<T[]>;
    createOrUpdate(query: any, data: object): Promise<T | null>;
    update(_id: string, data: object): Promise<boolean>;
    findOneAndUpdate(query: object, data: object): Promise<T | null>;
    findAndUpdateAll(query: object, data: object): Promise<any>;
    updateDataByFields(_id: string, data: any, parentField?: string): Promise<void>;
    delete(_id: string, isRealDelete?: boolean): Promise<boolean>;
}
export default BaseRepository;
