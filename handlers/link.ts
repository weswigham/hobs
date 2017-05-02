import {Client, Message, RichEmbed} from "discord.js";
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
    let filtered: string = "";
    try {
        filtered = fromHTMLtoMarkdown(item.description ? item.description.en : "");
    }
    catch (e) {
        console.log(e);
        console.log(item);
    }
    const name = (item.name && item.name.en) ? item.name.en : item.name;
    await message.channel.send('', {embed: {
        description: filtered,
        url: `https://www.fuzzwork.co.uk/info/?typeid=${item.id}`,
        title: name,
        thumbnail: {height: 128, width: 128, url: `https://imageserver.eveonline.com/Type/${item.id}_64.png`},
        timestamp: new Date(),
        footer: {
            icon_url: "https://www.eveonline.com/favicon.ico",
            text: "EVE Online"
        },
        fields: [
            {
                value: generateLinks(name, item),
                name: "Links",
                inline: true
            }
        ],
        color: 0xfa9e0e
    }});
}

function generateLinks(name: string, item: any) {
    const links = [`[EVE Central](https://eve-central.com/home/quicklook.html?typeid=${item.id})`];
    if (item.capacity && item.mass && item.volume && item.traits) {
        // Probably a ship
        links.push(`[Osmium](https://o.smium.org/browse/best?q=%40ship%20%22${name}%22)`);
    }
    return links.join(" ");
}