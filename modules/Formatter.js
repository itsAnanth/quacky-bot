import { Formatters } from 'discord.js';

class _Formatter {

    static warns(data) {
        if (data.length == 0) return ['No Case Logs Found'];
        const formatted = data.map((v, i) => {
            return `**Case: ${i + 1}**\n**Moderator:** <@${v.author}>\n**Reason:** ${v.reason}\n**Time:** ${Formatters.time(new Date(v.time))}`;
        });
        return formatted;
    }

    static rapsheet(data) {
        if (data.length == 0) return ['No Case Logs Found'];
        const formatted = data.map((v, i) => {
            return `**Case: ${i + 1}**\n**Moderator:** <@${v.author}>\n**Type:** ${v.type}\n**Reason:** ${v.reason}\n**Time:** ${Formatters.time(new Date(v.time))}`;
        });
        return formatted;
    }

}


export default _Formatter;

