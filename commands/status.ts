import esi = require("eve-online-esi");
import commando = require("discord.js-commando");
import {GetStatusOk} from "eve-online-esi";

export = class TranqulityStatus extends commando.Command { 
    constructor(client: commando.CommandoClient, info: commando.CommandInfo) {
        super(client, {
            name: "status",
            memberName: "status",
            aliases: [],
            group: "trivial",
            description: "Show Tranquility server status",
            details: "Queries the ESI API for the tranquility server status and active playercount.",
            examples: ["status"],
            throttling: {duration: 60, usages: 5},
        });
    }
    async run(message: commando.CommandMessage, args: object | string | string[], fromPattern?: boolean) {
        const status = new esi.StatusApi();
        try {
            const resp = (await status.getStatus()).body as GetStatusOk;
            if (resp.vip) {
                return message.reply(`Tranquility is currently in VIP mode.`);
            }
            return message.reply(`Tranquility is online with ${resp.players} capsuleers online.`);
        }
        catch (e) {}
        return message.reply(`Tranquility seems to be down.`);
    }
};