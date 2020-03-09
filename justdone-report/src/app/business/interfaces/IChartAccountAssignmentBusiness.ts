import IBaseBusiness from './base/IBaseBusiness';
import ChartAccountAssignment from 'justdone-system-package/dest/app/model/chartAccountAssignment/ChartAccountAssignment';
import ChartAccountAssignmentCreate from 'justdone-system-package/dest/app/model/chartAccountAssignment/ChartAccountAssignmentCreate'; // eslint-disable-line
import ChartAccountAssignmentUpdate from 'justdone-system-package/dest/app/model/chartAccountAssignment/ChartAccountAssignmentUpdate'; // eslint-disable-line

interface IChartAccountAssignmentBusiness extends IBaseBusiness<ChartAccountAssignment> {
    getCoaByClient: (originId: string, productCode: number, userId: string, keyword: string, page: number, limit: number) => Promise<any>;
    create: (data: ChartAccountAssignmentCreate) => Promise<ChartAccountAssignment>;
}

export default IChartAccountAssignmentBusiness;
