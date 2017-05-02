import {Client, Message} from "discord.js";
import {CommandContext} from "../";
import {fromHTMLtoMarkdown} from "../util";

export default async function({bot, message, sanitized, sde}: CommandContext) {
    const prefix = "link ";
    if (!sanitized.startsWith(prefix)) {
        return;
    }
    
    const searchText = sanitized.substring(prefix.length);
    console.log(`Looking up item: ${searchText}`);
    let item: any;
    try {
        item = await sde.lookup(searchText);
    }
    catch (e) {
        console.log(e);
    }
    
    if (!item) {
        await message.channel.send(`Item '${searchText}' could not be found.`);
        return;
    }
    await message.channel.send(fromHTMLtoMarkdown(item.description.en));
}