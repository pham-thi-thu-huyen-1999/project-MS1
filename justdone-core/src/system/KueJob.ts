import * as kue from 'kue';
// import {Container} from 'typedi';
// import IYodleeBusiness from '../app/business/interfaces/IYodleeBusiness';
// import YodleeBusiness from '../app/business/YodleeBusiness';

export interface IKueJob{
    initJob();
}

export default class KueJob implements IKueJob {
    static queue: any;

    async initJob() {
        KueJob.queue.active(function(err, ids) {
            if (err)
                return;
            ids.forEach(function(id) {
                kue.Job.get(id, function(err, job) {
                    if (err) {
                        return;
                    }
                    job.inactive();
                });
            });
        });
        KueJob.queue.on('error', function(err) {
            console.log('has an error', err);
        });
        // KueJob.queue.on('job failed', function(id, result) {
        //     kue.Job.get(id, function(err, job) {
        //         if (!err)
        //             job.state('inactive').save();
        //     });
        // });
        // kue.Job.rangeByState( 'complete', 0, 100, 'asc', function( err, jobs ) {
        //     jobs.forEach( function( job ) {
        //         job.remove( function() {
        //             console.log( 'removed ', job.id );
        //         });
        //     });
        // });
    }
}
