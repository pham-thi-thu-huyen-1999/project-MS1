declare class Refreshinfo {
    lastRefreshed?: Date;
    nextRefreshScheduled?: Date;
    lastRefreshAttempt?: Date;
    statusMessage?: string;
    statusCode?: number;
    constructor(model: Refreshinfo);
}
export default Refreshinfo;
