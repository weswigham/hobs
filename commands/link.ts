import commando = require("discord.js-commando");
import {Client, Message, RichEmbed} from "discord.js";
import {fusedTypes as types} from "../data";
import {fromHTMLtoMarkdown} from "../util";

export = class LinkObject extends commando.Command { 
    constructor(client: commando.CommandoClient, info: commando.CommandInfo) {
        super(client, {
            name: "link",
            memberName: "link",
            aliases: [],
            group: "trivial",
            description: "Show info about a given item",
            details: "Looks up data for an item within EVE and displays its description, icon, and links to relevant resources.",
            examples: ["link Raven"],
            throttling: {duration: 60, usages: 5},
        });
    }
    async run(message: commando.CommandMessage, args: string[], fromPattern?: boolean) {
        const searchText = args.join(" ").replace("PLEX", "Pilot's License Extension (PLEX)"); // Improve accuracy for common abbrev.

        console.log(`Looking up item: ${searchText}`);
        let item: any;
        try {
            const s = await types;
            const results = s.search<any>(searchText);
            item = results[0];
            console.log(`Score: ${item.score}, name: ${item.item.name.en}`);
            if (item.score > 0.3) {
                item = undefined;
            }
            else {
                item = item.item;
            }
        }
        catch (e) {
            console.log(e);
        }
        
        if (!item) {
            return await message.channel.send(`Item '${searchText}' could not be found.`);
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
        const links = generateLinks(name, item);
        return await message.channel.send('', {embed: {
            description: filtered,
            url: `https://www.fuzzwork.co.uk/info/?typeid=${item.id}`,
            title: name,
            thumbnail: {height: 128, width: 128, url: `https://imageserver.eveonline.com/Type/${item.id}_64.png`},
            timestamp: new Date(),
            footer: {
                icon_url: "https://www.eveonline.com/favicon.ico",
                text: "EVE Online"
            },
            fields: (links && links.length) ? [
                {
                    value: links,
                    name: "Links",
                    inline: true
                }
            ] : [],
            color: 0xfa9e0e
        }});
    }
};

function generateLinks(name: string, item: any) {
    const links = [];
    if (item.marketGroupID) {
        // Appears on public market
        links.push(`[EVE Central](https://eve-central.com/home/quicklook.html?typeid=${item.id})`);
    }
    if (item.capacity && item.mass && item.volume && item.traits) {
        // Probably a ship
        links.push(`[Osmium](https://o.smium.org/browse/best?q=%40ship%20%22${name}%22)`);
        links.push(`[zKillboard](https://zkillboard.com/ship/${item.id}/)`);
    }
    return links.join(" - ");
}