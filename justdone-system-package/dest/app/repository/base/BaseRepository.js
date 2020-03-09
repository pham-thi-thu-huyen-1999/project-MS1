"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pagination_1 = require("../../model/common/Pagination");
const DataHelper_1 = require("../../../helpers/DataHelper");
class BaseRepository {
    constructor(schemaModel) {
        this.model = schemaModel;
    }
    validateParam(param) {
        if (!param)
            param = {};
        if (!param.query)
            param.query = {};
        if (param.populate && typeof param.populate !== 'object')
            param.populate = null;
        if (param.query.deletedAt === undefined)
            param.query.deletedAt = null;
        return param;
    }
    find(param, order, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            param = this.validateParam(param);
            let query = this.model.find(param.query);
            if (param.select)
                query = query.select(param.select);
            if (param.populate)
                query = query.populate(param.populate);
            let pagination = new Pagination_1.default(page, limit);
            if (order)
                query = query.sort(order);
            query = query.skip(pagination.skip).limit(pagination.limit);
            return (yield query.exec().then(docs => docs.map(doc => doc.toJSON())));
        });
    }
    findAll(param, order) {
        return __awaiter(this, void 0, void 0, function* () {
            param = this.validateParam(param);
            let query = this.model.find(param.query);
            if (param.select)
                query = query.select(param.select);
            if (param.populate)
                query = query.populate(param.populate);
            if (order)
                query = query.sort(order);
            return (yield query.exec().then(docs => docs.map(doc => doc.toJSON())));
        });
    }
    findOne(param) {
        return __awaiter(this, void 0, void 0, function* () {
            param = this.validateParam(param);
            let query = this.model.findOne(param.query);
            if (param.select)
                query = query.select(param.select);
            if (param.populate)
                query = query.populate(param.populate);
            return (yield query.exec().then(doc => doc ? doc.toJSON() : null));
        });
    }
    getCount(param) {
        return __awaiter(this, void 0, void 0, function* () {
            param = this.validateParam(param);
            return yield this.model.find(param.query).count();
        });
    }
    get(_id, populate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (populate && typeof populate !== 'object')
                populate = null;
            let query = this.model.findById(_id);
            if (populate)
                query = query.populate(populate);
            return (yield query.exec().then(doc => doc ? doc.toJSON() : null));
        });
    }
    aggregate(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.aggregate(query).exec();
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.model.create(data).then(doc => doc ? doc.toJSON() : null));
        });
    }
    createMultiple(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.model.create(data).then(docs => docs.map(doc => doc.toJSON())));
        });
    }
    createOrUpdate(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = { upsert: true, new: true, setDefaultsOnInsert: true };
            return (yield this.model.findOneAndUpdate(query, data, options).exec().then(doc => doc ? doc.toJSON() : null));
        });
    }
    update(_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.model.update({ _id: DataHelper_1.default.toObjectId(_id) }, data).exec();
            return result && result.ok > 0;
        });
    }
    findOneAndUpdate(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.model.findOneAndUpdate(query, data, { new: true }).exec().then(doc => doc ? doc.toJSON() : null));
        });
    }
    findAndUpdateAll(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.model.update(query, data, { multi: true }).exec());
        });
    }
    updateDataByFields(_id, data, parentField) {
        return __awaiter(this, void 0, void 0, function* () {
            if (_id && data) {
                for (let field in data) {
                    if (data.hasOwnProperty(field)) {
                        let prop = parentField ? parentField + '.' + field : field;
                        let dataUpdate = {};
                        dataUpdate[prop] = data[field];
                        yield this.update(_id, dataUpdate);
                    }
                }
            }
        });
    }
    delete(_id, isRealDelete = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isRealDelete) {
                let result = yield this.model.update({ _id: DataHelper_1.default.toObjectId(_id) }, { deletedAt: new Date() }).exec();
                return result && result.ok > 0;
            }
            yield this.model.remove({ _id: DataHelper_1.default.toObjectId(_id) }).exec();
            return true;
        });
    }
}
exports.default = BaseRepository;
