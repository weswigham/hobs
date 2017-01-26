import yaml = require("js-yaml");
import discord = require("discord.js");

const bot = new discord.Client();
bot.on("ready", async () => {
    console.log("Hobs, reporting for duty.");
    const invite = await bot.generateInvite(0);
    console.log(`Invite: ${invite}`);
});

function isSelf(bot: discord.Client, user: discord.User) {
    return bot.user.id === user.id;
}

function mentionsSelf(bot: discord.Client, message: discord.Message) {
    return message.mentions && message.mentions.users.has(bot.user.id);
}

bot.on("message", message => {
    if (message.content.indexOf("ping") >= 0 && mentionsSelf(bot, message)) {
        message.channel.sendMessage("pong");
    }
});

bot.login(process.env.DISCORD_TOKEN);
