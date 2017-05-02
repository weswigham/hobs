/// <reference path="./shims.d.ts" />

import discord = require("discord.js");
import eve = require("eve-online-sde");

export interface CommandContext {
    bot: discord.Client;
    message: discord.Message;
    sanitized: string;
    sde: typeof eve
}

import handle from "./handlers";

const bot = new discord.Client();
bot.on("ready", async () => {
    console.log("Hobs, reporting for duty.");
    const invite = await bot.generateInvite(0);
    console.log(`Invite: ${invite}`);
});

function mentionsSelf(bot: discord.Client, message: discord.Message) {
    return message.mentions && message.mentions.users && message.mentions.users.has(bot.user.id);
}

bot.on("message", async (message) => {
    if (!message.author.bot && (mentionsSelf(bot, message) || message.channel.type === "dm")) {
        // Provide a sanitized message content with the self mention removed
        await handle({bot, message, sanitized: message.cleanContent.replace("@hobs", "").trim(), sde: eve});
    }
});

bot.login(process.env.DISCORD_TOKEN);
