"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Refreshinfo {
    constructor(model) {
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
exports.default = Refreshinfo;
