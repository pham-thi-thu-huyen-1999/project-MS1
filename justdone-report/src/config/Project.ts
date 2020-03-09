import Default from './env/Default';
import {IProject} from 'justdone-system-package/dest/config';
class Project {
    static getConfiguration() {
        // Get the current config
        let envConfig = require(`./env/${process.env.NODE_ENV}`);
        let config = {
            ...Default,
            ...envConfig.default
        };
        return config;
    }
}

Object.seal(Project);
export default <IProject>Project.getConfiguration();

