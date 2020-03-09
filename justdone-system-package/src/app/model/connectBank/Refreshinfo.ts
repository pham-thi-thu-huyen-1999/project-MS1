class Refreshinfo {
    lastRefreshed?: Date;
    nextRefreshScheduled?: Date;
    lastRefreshAttempt?: Date;
    statusMessage?: string;
    statusCode?: number;
    constructor(model: Refreshinfo) {
        if (!model)
            return;

        this.lastRefreshed = model.lastRefreshed;
        this.nextRefreshScheduled = model.nextRefreshScheduled;
        this.lastRefreshAttempt = model.lastRefreshAttempt;
        this.statusMessage = model.statusMessage;
        this.statusCode = model.statusCode;
    }
}

Object.seal(Refreshinfo);
export default Refreshinfo;
