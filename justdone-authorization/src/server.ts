import * as express from 'express';
import * as http from 'http';
import * as cluster from 'cluster';
import * as os from 'os';
import Project from './config/Project';
import BusinessLoader from './system/BusinessLoader';
import {Config} from 'justdone-system-package/dest/config';
import {DataAccess} from 'justdone-system-package/dest/app/dataAccess/DataAccess';
import MiddlewareLoader from './system/MiddlewareLoader';
import CachingAccess from './app/dataAccess/CachingAccess';
import createServerCaching from './serverCaching';
import CachingHelper from 'justdone-system-package/dest/helpers/CachingHelper';

Config.init(Project);
DataAccess.connect();
const debug = require('debug')('express-mongodb:server');

function checkAndCreateAllDataCaching() {
    // Check all data have cached yet when start project
    CachingHelper.post('/check-and-create-all-data-caching').catch(error => {
        console.log('server.checkAndCreateAllDataCaching\n', error);
    });
}
if (process.env.SINGLE_THREAD) {
    CachingAccess.init();
    BusinessLoader.init();
    createServerCaching();
    createServer();
    console.log('\x1b[32m', `\nhttp://localhost${Project.PORT === 80 ? '' : ':' + Project.PORT}`, '\x1b[0m');
    checkAndCreateAllDataCaching();
}
else {
    if (cluster.isMaster) {
        CachingAccess.init();
        BusinessLoader.init();
        createServerCaching();

        console.log('\x1b[32m', `\nhttp://localhost${Project.PORT === 80 ? '' : ':' + Project.PORT}`, '\x1b[0m');
        let numCPUs = os.cpus().length;

        // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
            cluster.fork();
        });
        console.log(`Master ${process.pid} is started`);
        // setTimeout(checkAndCreateAllDataCaching, 2000);
    }
    else {
        // Workers can share any TCP connection
        // In this case it is an HTTP server
        BusinessLoader.init();
        createServer();
        checkAndCreateAllDataCaching();
        console.log(`Worker ${process.pid} is started`);
    }
}
function createServer() {
    let app = express();
    app.use(MiddlewareLoader.configuration);
    return createHttpServer(app, Project.PORT);
}

function createHttpServer(app: express.Express, port: number) {
    /**
     * Create HTTP server.
     */
    app.set('port', port);
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
}
