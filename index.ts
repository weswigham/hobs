/// <reference path="./shims.d.ts" />

import discord = require("discord.js");
import eve = require("eve-online-sde");
import esi = require("eve-online-esi");
import fuse = require("fuse.js");
import http = require("http");

const fusedTypes: Promise<fuse> = eve.types().then(t => {
    return new fuse(Object.keys(t).map(k => (t[k].id = k, t[k])), {
        caseSensitive: false,
        keys: ["name.en"],
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 2,
        includeScore: true
    });
});

export interface CommandContext {
    bot: discord.Client;
    message: discord.Message;
    sanitized: string;
    sde: typeof eve;
    types: typeof fusedTypes;
    esi: typeof esi;
}

import handle from "./handlers";

const bot = new discord.Client();
bot.on("ready", async () => {
    console.log("Hobs, reporting for duty.");
    const invite = await bot.generateInvite(0);
    console.log(`Invite: ${invite}`);
    http.createServer((req, res) => {
        res.write(invite);
        res.end();
    }).listen(process.env.port || 80);
});

function mentionsSelf(bot: discord.Client, message: discord.Message) {
    return message.mentions && message.mentions.users && message.mentions.users.has(bot.user.id);
}

bot.on("message", async (message) => {
    if (!message.author.bot && (mentionsSelf(bot, message) || message.channel.type === "dm")) {
        // Provide a sanitized message content with the self mention removed
        await handle({bot, message, sanitized: message.cleanContent.replace("@hobs", "").trim(), sde: eve, types: fusedTypes, esi});
    }
});

const AUTHENTICATE = true;

bot.on("guildMemberAdd", member => {
    if (!AUTHENTICATE) return;
    member.send(`Hi! Welcome to this server! Log in to the bot with EVE here: `);
});

bot.login(process.env.DISCORD_TOKEN);
