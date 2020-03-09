import * as kue from 'kue';
// import {worker} from 'cluster';
// import {Service} from 'typedi';

export interface IKueJob{
    initJob();
}

export default class KueJob implements IKueJob {
    static queue: any;

    // constructor() {
    //     KueJob.queue = kue.createQueue({
    //         redis: {
    //             port: Number(process.env.REDIS_PORT),
    //             host: process.env.DOCKER_MODE && JSON.parse(process.env.DOCKER_MODE) ? process.env.REDIS_HOST : 'localhost'
    //         }
    //     });
    // }

    async initJob() {
        KueJob.queue.process('crawl-production', 1, this.handlerJobCrawlProduct);

        KueJob.queue.active(function(err, ids) {
            if (err)
                return;
            ids.forEach(function(id) {
                kue.Job.get(id, function(err, job) {
                    if (err) {
                        console.log('error inactive');
                        return;
                    }
                    job.inactive();
                });
            });
        });
        KueJob.queue.on('error', function(err) {
            console.log('has an error', err);
        });
        KueJob.queue.on('job failed', function(id, result) {
            kue.Job.get(id, function(err, job) {
                if (!err)
                    job.state('inactive').save();
            });
        });
        // kue.Job.rangeByState( 'complete', 0, 100, 'asc', function( err, jobs ) {
        //     jobs.forEach( function( job ) {
        //         job.remove( function() {
        //             console.log( 'removed ', job.id );
        //         });
        //     });
        // });
    }

    // async protechFormAmazon()
    // {

    // }

    async handlerJobCrawlProduct(job: any, done: any) {
        // let data = job.data;
        // try {
        //     let product = await ProductBusiness.getProduct(data);
        //     if (!product)
        //         throw new Error('can not get productions');
        //     JobHelper.createJobUpdateProduction(product);
        //     const productSeller = await ProductSellerBusiness.getProductSeller(data).catch(err => {
        //         console.log(err);
        //     });
        //     if (productSeller && productSeller.length > 0) {
        //         for (let i = 0; i < productSeller.length; i++) {
        //             let item = productSeller[i];
        //             let data = await SellerBusiness.countProductSeller(item.link).catch(err => {
        //                 console.log(err);
        //             });
        //             if (data)
        //                 item.listProductSeller = data;
        //         }
        //         JobHelper.createJobUpdateProductSeller(productSeller);
        //     }

        //     const question = await QuestionBusiness.getQuestion(data).catch(err => {
        //         console.log(err);
        //     });
        //     if (question)
        //         JobHelper.createJobUpdateQuestion(question);

        //     const review = await ReviewBusiness.getReview(data).catch(err => {
        //         console.log(err);
        //     });
        //     if (review)
        //         JobHelper.createJobUpdateReview(review);

        //     console.log('task is finish!!!!', data);
        //     done();
        // }
        // catch (err) {
        //     console.log('has error', err);
        //     job.failed().error(err);
        //     worker.send('exit');
        //     process.exit(0);
        // }
    }
}
