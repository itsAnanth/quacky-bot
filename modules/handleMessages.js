import db from './db/server.js';
import cron from 'cron';
import logger from './logger.js';

const CronJob = cron.CronJob;


export default async function(bot, message) {
    const now = Date.now();
    const id = message.author.id;
    const data = bot.eventCooldown[id];
    if (!data) {
        await db.utils.set_event_msg(message.author.id);
        bot.eventCooldown[id] = Date.now();
    } else if (Math.abs(now - data) >= 5000)
        delete bot.eventCooldown[id];
}

async function resetDB() {
    const job = new CronJob('1 1 1 * * 0', async() => { // Every Sunday at approx. 1am
        await db.utils.reset_event_msg();
    }, null, true, 'Europe/London');
    job.start();
    logger.debug('CRON', 'Initialized timer');
}

export { resetDB };
