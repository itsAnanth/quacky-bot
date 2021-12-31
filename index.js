import { config } from 'dotenv';
import { Client, Intents } from 'discord.js';
import logger from './modules/logger.js';
import { handleEvents, handleCommands } from './modules/core/index.js';
import initUtils from './modules/utils.js';

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    bot = new Client({ disableMentions: 'everyone', intents: intents });


(async function() {
    global.logger = logger;
    config();
    initUtils();
    await handleCommands(bot);
    await handleEvents(bot);
})();

const env = process.env.NODE_ENV == 'PRODUCTION' ? 'PROD' : 'DEV';
bot.login(env == 'PROD' ? process.env.TOKEN : process.env.TEST_TOKEN);
