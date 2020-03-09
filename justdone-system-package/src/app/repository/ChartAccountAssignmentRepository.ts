import IChartAccountAssignment from '../model/chartAccountAssignment/interfaces/IChartAccountAssignment'; // eslint-disable-line
import ChartAccountAssignmentSchema from '../dataAccess/schemas/ChartAccountAssignmentSchema';
import BaseRepository from './base/BaseRepository';
import ChartAccountAssignment from '../model/chartAccountAssignment/ChartAccountAssignment';// eslint-disable-line
import ChartAccountAssignmentCreate from '../model/chartAccountAssignment/ChartAccountAssignmentCreate';// eslint-disable-line
import ChartAccountAssignmentUpdate from '../model/chartAccountAssignment/ChartAccountAssignmentUpdate';// eslint-disable-line

class ChartAccountAssignmentRepository extends BaseRepository<IChartAccountAssignment> {
    constructor() {
        super(ChartAccountAssignmentSchema);
    }

    async create(data: ChartAccountAssignmentCreate): Promise<IChartAccountAssignment> {
        return await super.create(data);
    }

    async update(_id: string, data: ChartAccountAssignmentUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }
}

Object.seal(ChartAccountAssignmentRepository);
export default ChartAccountAssignmentRepository;
