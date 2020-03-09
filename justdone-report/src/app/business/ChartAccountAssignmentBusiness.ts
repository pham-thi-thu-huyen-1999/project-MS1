import IChartAccountAssignmentBusiness from './interfaces/IChartAccountAssignmentBusiness'; // eslint-disable-line
import ChartAccountAssignmentRepository from 'justdone-system-package/dest/app/repository/ChartAccountAssignmentRepository';
import ChartAccountAssignment from 'justdone-system-package/dest/app/model/chartAccountAssignment/ChartAccountAssignment';
import ChartAccountAssignmentCreate from 'justdone-system-package/dest/app/model/chartAccountAssignment/ChartAccountAssignmentCreate'; // eslint-disable-line
import ChartAccountAssignmentUpdate from 'justdone-system-package/dest/app/model/chartAccountAssignment/ChartAccountAssignmentUpdate'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import DataHelper from 'justdone-system-package/dest/helpers/DataHelper';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';
import module from 'justdone-system-package/dest/resources/permission/module';
import {RoleCode} from 'justdone-system-package/dest/app/model/common/CommonType'; // eslint-disable-line
class ChartAccountAssignmentBusiness implements IChartAccountAssignmentBusiness {
    private chartAccountAssignmentRepository: ChartAccountAssignmentRepository;

    constructor() {
        this.chartAccountAssignmentRepository = new ChartAccountAssignmentRepository();
    }

    async get(_id: string): Promise<ChartAccountAssignment | null> {
        if (!_id)
            return null;

        let chartAccount = await this.chartAccountAssignmentRepository.get(_id);
        return chartAccount && new ChartAccountAssignment(chartAccount);
    }

    async getCoaByClient(originId: string, productCode: number, userId: string, keyword: string, page: number, limit: number): Promise<any> {
        if (!originId)
            throw new ErrorCommon(101, 'Request');
        let products = await Authenticator.filterProductsPermission([module.CHART_OF_ACCOUNT.claim.GET.code], originId, [productCode]);
        if (!products || !products.length)
            return [];
        // let product = await BusinessLoader.productBusiness.getByCode(productCode);
        // if (!product)
        //     throw new ErrorCommon(104, 'Product code');

        let params: any[] = [
            {$match: {product: {$in: products.map(product => DataHelper.toObjectId(product._id))}}},
            {$match: {client: DataHelper.toObjectId(userId)}},
            {
                $lookup: {
                    from: 'chartaccounts',
                    localField: 'coa',
                    foreignField: '_id',
                    as: 'coaRef'
                }
            },
            {$unwind: '$coaRef'}
        ];

        if (keyword)
            params.push({$match: {'coaRef.searchTerm': {$regex: new RegExp(keyword, 'i')}}});

        params.push( {$sort: {'coaRef.code': 1}});
        params.push({$skip: (page - 1) * limit}, {$limit: limit});
        return await this.chartAccountAssignmentRepository.aggregate(params);
    }

    async create(data: ChartAccountAssignmentCreate): Promise<ChartAccountAssignment> {
        let chartAccount;
        chartAccount = await this.chartAccountAssignmentRepository.create(data);
        return chartAccount && new ChartAccountAssignment(chartAccount);
    }

    async update(_id: string, data: ChartAccountAssignmentUpdate): Promise<ChartAccountAssignment | null> {
        await this.chartAccountAssignmentRepository.update(_id, data);
        return await this.get(_id);
    }

    async delete(_id: string): Promise<boolean> {
        return await this.chartAccountAssignmentRepository.delete(_id, true);
    }
}

Object.seal(ChartAccountAssignmentBusiness);
export default ChartAccountAssignmentBusiness;
