import IBaseModel from '../../common/interfaces/IBaseModel';

interface IChartAccountAssignment extends IBaseModel {
    coa: string,
    product: string,
    client: string
}

export default IChartAccountAssignment;
