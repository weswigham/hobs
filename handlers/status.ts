import {CommandContext} from "../";
import {GetStatusOk} from "eve-online-esi";

export default async function(ctx: CommandContext) {
    if (ctx.sanitized !== "status") return;
    const status = new ctx.esi.StatusApi();
    try {
        const resp = (await status.getStatus()).body as GetStatusOk;
        if (resp.vip) {
            await ctx.message.reply(`Tranquility is currently in VIP mode.`);
            return;
        }
        await ctx.message.reply(`Tranquility is online with ${resp.players} capsuleers online.`);
        return;
    }
    catch (e) {}
    await ctx.message.reply(`Tranquility seems to be down.`);
    return;
}

export const short = "Show Tranquility server status";