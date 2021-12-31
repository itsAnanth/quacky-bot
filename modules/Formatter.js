import { Formatters } from 'discord.js';

class _Formatter {

    static warns(data) {
        if (data.length == 0) return ['No Case Logs Found'];
        const formatted = data.map((v, i) => {
            return `**Case: ${i}**\n**Moderator:** <@${v.author}>\n**Reason:** ${v.reason}\n**Time:** ${Formatters.time(v.time)}`;
        });
        return formatted;
    }

}


export default _Formatter;

