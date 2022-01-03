import { id } from '../data/index.js';
import util from 'util';
import 'colors';


let LogChannel;

/**
 * Logging core functionalities
 * @param {String}  logMessage  The message to be logged
 */
function info(logMessage = ' ') {
    console.info(`=== ${logMessage.green} ===`);
}

/**
 * Advanced logging
 * @param {String}  functonName The name of the function to be logged
 * @param {String}  logMessage  The message to be logged
 */
function debug(functionName = ' ', logMessage = ' ') {
    console.info(`>>> ${functionName.blue} | ${logMessage.yellow} <<<`);
}

/**
 * Error logging
 * @param {String}  functonName     The name of the function calling an error
 * @param {String}  errorMessage    The error message to be logged
 */

let error = function(functionName = ' ', errorMessage = ' ') {
    console.error(`!!! ${functionName} | ${errorMessage} !!!`.red);
};

/**
 * Unhandled Error logging
 * @param  {Error} error
 */
function unhandledError(e) {
    error('Unhandled Error', util.inspect(e));
}


async function init(bot) {
    LogChannel = await bot.channels.fetch(id.channels['crash-logs']);
    error = (functionName = ' ', errorMessage = ' ') => {
        console.error(`!!! ${functionName} | ${errorMessage} !!!`.red);
        if (LogChannel)
            return LogChannel.send({ content: `**${functionName}**\n\`\`\`js\n${errorMessage}\`\`\` ` });
    };
    return true;
}


export default { error, info, unhandledError, debug, init };
export { error, info, unhandledError, debug, init };
