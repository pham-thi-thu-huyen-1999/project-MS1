import KueJob from '../system/KueJob';

class JobHelper {
    static loadTransactionAndSaveFromBankService(jobData: any) {
        // return new Promise((resolve, reject) => {
        let job = KueJob.queue.create('load-transaction-and-save', jobData).attempts(3).backoff({delay: 60 * 1000, type: 'fixed'}).save(function(err) {
            if (!err) {}
        });
        job.on('complete', () => {
        });
    }

    private static updateJob(job: any) {
        return new Promise(resolve => {
            job.update(() => resolve());
        });
    }
}

Object.seal(JobHelper);
export default JobHelper;
