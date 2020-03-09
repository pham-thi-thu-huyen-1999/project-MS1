import * as cron from 'cron';
import BusinessLoader from '../system/BusinessLoader';

export default class CronJob {
    public jobGetTransaction: cron.CronJob;
    private yodleeBusiness = BusinessLoader.yodleeBusiness;

    constructor() {
        this.jobGetTransaction = new cron.CronJob({
            cronTime: '0 0 1 * * *', // 1 AM => 0 0 1 * * *  // 2 minute */2 * * * *
            onTick: () => {
                this.yodleeBusiness.cronTransactionAllClient();
            },
            start: false,
            timeZone: 'Australia/Sydney'
        });
    }

    startAllJob() {
        this.jobGetTransaction.start();
    }
}
