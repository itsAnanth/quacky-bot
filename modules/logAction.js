import db from './db/server.js';

export default async function(bot, embed, type) {
    const Lchannels = await db.utils.log_channels();
    const mId = Lchannels[type];
    if (!mId) return;
    const mC = bot.channels.resolve(mId);
    if (!mC) return;
    await mC.send({ embeds: [embed] }).catch(console.error);
}
