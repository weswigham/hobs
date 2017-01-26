import discord = require("discord.js");

export interface CommandContext {
    bot: discord.Client;
    message: discord.Message;
    sanitized: string;
    sde: {}
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

bot.on("message", message => {
    if (mentionsSelf(bot, message)) {
        // Provide a sanitized message content with the self mention removed
        handle({bot, message, sanitized: message.cleanContent.replace("@hobs", "").trim(), sde: {}});
    }
});

bot.login(process.env.DISCORD_TOKEN);
