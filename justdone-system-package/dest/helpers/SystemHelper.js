"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const os = require("os");
const disk = require("diskusage");
const DateHelper_1 = require("./DateHelper");
class SystemHelper {
    static getSytemInfo() {
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
            name: config_1.Config.PROJECT.PROJECT_NAME,
            domain: config_1.Config.PROJECT.DOMAIN,
            port: config_1.Config.PROJECT.PORT,
            cpu: {
                free: CPUFree,
                used: CPUUsed
            },
            memory: {
                free: memmoryFree,
                used: memmoryUsed
            },
            operatingSystem: os.type() ? os.type() : '',
            disk: {
                free: DiskFree,
                used: DiskUsed
            },
            status: status,
            deploy: DateHelper_1.default.addSeconds(new Date(), -Math.round(os.uptime()))
        };
    }
}
exports.default = SystemHelper;
;
