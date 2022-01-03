import fs from 'fs';
import logger from '../logger.js';

async function init(bot) {
    const eventsFolder = fs.readdirSync('./events').filter(x => x.endsWith('js') && x != 'index.js');
    for (const file of eventsFolder) {
        let event = await import(`../../events/${file}`);
        event = event.default;
        bot.on(event.name.toString(), event.execute.bind(null, bot));
        logger.debug('[event handler]', `${event.name}`);
    }
}

export default init;
