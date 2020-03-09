import {Config} from '../config';
import * as os from 'os';
import * as disk from 'diskusage';
import DateHelper from './DateHelper';
// import osUtils from 'os-utils';

export default class SystemHelper {
    static getSytemInfo() {
        // let freeCpu: number = 0;
        // let totalCpu: number = 0;
        // let availableDisk: number = 0;
        // let totalDisk: number = 0;

        // os.cpus().forEach(cpu => {
        //     totalCpu = totalCpu + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq;
        //     freeCpu = freeCpu + cpu.times.idle;
        // });
        let status = true;
        let cpus = os.cpus();
        let totalTime = 0;
        let totalIdle = 0;
        let availableDisk = 0;
        let totalDisk = 0;

        let DiskFree = 0;
        let DiskUsed = 0;
        let memmoryFree = 0;
        let memmoryUsed = 0;
        let CPUFree = 0;
        let CPUUsed = 0;
        for (let i = 0; i < cpus.length; i++) {
            let cpu = cpus[i];
            for (let type in cpu.times) {
                if ({}.hasOwnProperty.call(cpu.times, type)) {
                    totalTime += cpu.times[type];
                    if (type === 'idle') {
                        totalIdle += cpu.times[type];
                        console.log('totalIdle', totalIdle);
                    }
                }
            }
        }
        try {
            CPUFree = Math.round(totalIdle / totalTime * 100);
            CPUUsed = 100 - CPUFree;
        }
        catch (err) {
            console.log('cpu', err);
        }

        try {
            memmoryFree = Math.round(os.freemem() / os.totalmem() * 100);
            memmoryUsed = 100 - memmoryFree;
        }
        catch (err) {
            console.log('memory', err);
        }

        let path = os.platform() === 'win32' ? 'c:' : '/';

        try {
            let info = disk.checkSync(path);
            availableDisk = info.available;
            totalDisk = info.total;
            DiskFree = Math.round((availableDisk / totalDisk * 100));
            DiskUsed = 100 - DiskFree;
        }
        catch (err) {
            console.log('disk', err);
        }

        return {
            name: Config.PROJECT.PROJECT_NAME,
            domain: Config.PROJECT.DOMAIN,
            port: Config.PROJECT.PORT,
            cpu: {
                // free: freeCpu,
                // total: totalCpu,
                free: CPUFree,
                used: CPUUsed
            },
            memory: {
                // free: os.freemem() ? Math.round(os.freemem()) : 0,
                // total: os.totalmem() ? Math.round(os.totalmem()) : 0
                free: memmoryFree,
                used: memmoryUsed
            },
            operatingSystem: os.type() ? os.type() : '',
            disk: {
                // free: availableDisk,
                // total: totalDisk
                free: DiskFree,
                used: DiskUsed
            },
            status: status,
            deploy: DateHelper.addSeconds(new Date(), -Math.round(os.uptime()))
        };
    }
};
