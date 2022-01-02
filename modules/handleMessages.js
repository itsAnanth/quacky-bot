import db from './db/server.js';


export default async function(bot, message) {
    const now = Date.now();
    const id = message.author.id;
    const data = bot.eventCooldown[id];
    if (!data) {
        await db.utils.set_event_msg(message.author.id);
        console.log('added + 1');
        bot.eventCooldown[id] = Date.now();
    } else if (Math.abs(now - data) >= 5000)
        delete bot.eventCooldown[id];
    // eslint-disable-next-line no-useless-return
    // else if (now < (data + 1000))
    //     return console.log(now - (data + 1000));
}
