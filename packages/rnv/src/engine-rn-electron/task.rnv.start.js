import open from 'better-opn';
import { logErrorPlatform } from '../core/platformManager';
import { logTask, logError } from '../core/systemManager/logger';
import {
    MACOS,
    WINDOWS,
    TASK_START,
    TASK_CONFIGURE
} from '../core/constants';
import {
    runElectronDevServer,
} from '../sdk-electron';
import { waitForWebpack } from '../sdk-webpack';
import { executeTask } from '../core/engineManager';

export const taskRnvStart = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask('taskRnvStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        waitForWebpack(c)
            .then(() => open(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }

    await executeTask(c, TASK_CONFIGURE, TASK_START, originTask);

    switch (platform) {
        case MACOS:
        case WINDOWS:
            return runElectronDevServer(c, platform, port);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Starts bundler / server',
    fn: taskRnvStart,
    task: 'start',
    params: [],
    platforms: [
        MACOS,
        WINDOWS,
    ],
};