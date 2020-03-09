import * as express from 'express';
import * as http from 'http';
import * as cluster from 'cluster';
import * as os from 'os';
// import * as kue from 'kue';
// import * as typedi from 'typedi';
import Project from './config/Project';
import BusinessLoader from './system/BusinessLoader';
import MiddlewareLoader from './system/MiddlewareLoader';
// import KueJob from './system/KueJob';
import {DataAccess} from 'justdone-system-package/dest/app/dataAccess/DataAccess';
import {Config} from 'justdone-system-package/dest/config';

const app = express();
const port = Project.PORT;

app.set('port', port);
Config.init(Project);
BusinessLoader.init();
DataAccess.connect();
app.use(MiddlewareLoader.configuration);
const debug = require('debug')('express-mongodb:server');
// const kueConfig = {
//     redis: {
//         port: Project.REDIS.REDIS_HOST ? Number(Project.REDIS.REDIS_HOST) : 6379,
//         host: Project.REDIS.REDIS_HOST ? Project.REDIS.REDIS_HOST : 'localhost'
//     }
// };


if (['Development', 'Cloud'].find(env => env === process.env.NODE_ENV) && process.env.DEBUG_MODE) {
    // KueJob.queue = kue.createQueue(kueConfig);
    // const kueJob = typedi.Container.get(KueJob);
    // kueJob.initJob();
    createHttpServer();
    console.log('\x1b[32m', '\nhttp://localhost' + (port !== 80 ? ':' + port : '') + '\n', '\x1b[0m');
}
else {
    if (cluster.isMaster) {
        console.log('\x1b[32m', '\nhttp://localhost' + (port !== 80 ? ':' + port : '') + '\n', '\x1b[0m');
        let numCPUs = os.cpus().length;

        // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
        console.log(`Master ${process.pid} is started`);
    }
    else {
        // Workers can share any TCP connection
        // In this case it is an HTTP server
        // KueJob.queue = kue.createQueue(kueConfig);
        // const kueJob = typedi.Container.get(KueJob);
        // kueJob.initJob();
        createHttpServer();
        console.log(`Worker ${process.pid} is started`);
    }
}

function createHttpServer() {
    /**
     * Create HTTP server.
     */
    let server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on('error', onError);

    server.on('listening', () => {
        let addr = server.address();
        let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        debug('Listening on ' + bind);
    });
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    /* eslint-disable */
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
    /* eslint-enable */
}
