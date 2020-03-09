import IChartAccountAssignment from '../model/chartAccountAssignment/interfaces/IChartAccountAssignment';
import BaseRepository from './base/BaseRepository';
import ChartAccountAssignmentCreate from '../model/chartAccountAssignment/ChartAccountAssignmentCreate';
import ChartAccountAssignmentUpdate from '../model/chartAccountAssignment/ChartAccountAssignmentUpdate';
declare class ChartAccountAssignmentRepository extends BaseRepository<IChartAccountAssignment> {
    constructor();
    create(data: ChartAccountAssignmentCreate): Promise<IChartAccountAssignment>;
    update(_id: string, data: ChartAccountAssignmentUpdate): Promise<boolean>;
}
export default ChartAccountAssignmentRepository;
