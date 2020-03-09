import * as moment from 'moment';
import IHistoryBusiness from '../business/interfaces/IHistoryBusiness'; // eslint-disable-line
import History from '../model/history/History';
import HistoryCreate from '../model/history/HistoryCreate'; // eslint-disable-line
import HistoryUpdate from '../model/history/HistoryUpdate'; // eslint-disable-line
import HistoryRepository from '../repository/HistoryRepository';
import DataHelper from '../../helpers/DataHelper';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import module from 'justdone-system-package/dest/resources/permission/module';
import {ErrorCommon} from '../model/common/Error';

class HistoryBusiness implements IHistoryBusiness {
    private historyRepository: HistoryRepository;

    constructor() {
        this.historyRepository = new HistoryRepository();
    }

    async get(_id: string): Promise<History | null> {
        if (!_id)
            return null;

        let result = await this.historyRepository.get(_id);
        return result && new History(result);
    }

    async getList(userId: string, module: number, type: number, page: number, limit: number): Promise<History[]> {
        let params = <any>{query: {}};

        if (userId)
            params.query.userId = DataHelper.toObjectId(userId);

        if (module)
            params.query.system = module;

        if (type)
            params.query.type = type;

        return await this.historyRepository.find(params, {createdAt: -1}, page, limit);
    }

    async getCountByUserId(userId: string): Promise<number> {
        if (!userId)
            return 0;

        let params = {
            query: {
                userId: DataHelper.toObjectId(userId)
            }
        };

        return await this.historyRepository.getCount(params);
    }

    async getListSignIn(originId: string, isChoice: number, productCode: number): Promise<History[]> {
        let dateBegin; let dateNow;
        let totalCurentInMonth = moment().subtract(6, 'days').daysInMonth();

        if (isChoice === 1) {
            dateBegin = new Date(moment().subtract(6, 'days').format());
            dateNow = new Date(moment().format());
        }
        else {
            dateBegin = new Date(moment().subtract(totalCurentInMonth, 'days').format());
            dateNow = new Date(moment().format());
        }

        let {products, roles} = await Authenticator.filterPermission([module.ROLE.claim.GET.code], originId);
        const productQuery = productCode === 1 ? products.map(product => product.code) : [productCode];
        if (!roles || !roles.length)
            throw new ErrorCommon(101, 'Roles');
        if (!products || !products.length)
            throw new ErrorCommon(101, 'Products');

        let params = [{
            $match: {
                'createdAt': {$gte: dateBegin, $lte: dateNow},
                'roleId': {
                    $in: roles.map(role => DataHelper.toObjectId(role._id))
                },
                'productCode': {
                    $in: productQuery
                }
            }
        }, {
            $project: {createdAt: {$dateToString: {format: '%Y-%m-%d', date: '$createdAt'}}, roleId: '$roleId'}
        }, {
            $group: {
                _id: {createdAt: '$createdAt', roleId: '$roleId'},
                count: {$sum: 1}
            }
        }];

        let results = await this.historyRepository.aggregate(params);

        return results;
    }

    async create(data: HistoryCreate): Promise<History> {
        if (!data)
            throw new ErrorCommon(101, 'History');

        let result = await this.historyRepository.create(data);

        return result && new History(result);
    }

    async update(_id: string, data: HistoryUpdate): Promise<History | null> {
        if (!_id || !data)
            return null;

        let params = {
            query: {
                _id: DataHelper.toObjectId(_id)
            }
        };
        let result = await this.historyRepository.findOneAndUpdate(params, data);
        return result && new History(result);
    }

    async delete(_id: string): Promise<boolean> {
        if (!_id)
            return false;

        return await this.historyRepository.delete(_id);
    }

    async deleteMultiple(ids: string[]): Promise<boolean> {
        if (!ids.length)
            return false;

        for (let i = 0; i < ids.length; i++) {
            this.historyRepository.delete(ids[i]);
        }

        return true;
    }
}

Object.seal(HistoryBusiness);
export default HistoryBusiness;
