import Commando = require("discord.js-commando");
import http = require("http");
import path = require("path");
import sqlite = require("sqlite");


const bot = new Commando.CommandoClient({
    owner: process.env.OWNERID || "-1",
    commandPrefix: "!pls"
});

bot.registry.registerGroups([
    ["trivial", "Trivial Commands"]
])
.registerDefaults()
.registerCommands([require("./commands/link"), require("./commands/status")]);

bot.setProvider(
    sqlite.open(path.join(__dirname, "settings.sqlite3")).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

bot.on("error", console.error)
    .on("warn", console.warn)
    .on("debug", console.log)
    .on("ready", async () => {
        console.log("Hobs, reporting for duty.");
        console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator} (${bot.user.id})`);
        const invite = await bot.generateInvite(0);
        console.log(`Invite: ${invite}`);
        http.createServer((req, res) => {
            res.write(invite);
            res.end();
        }).listen(process.env.port || 80);
    })
    .on("disconnect", () => { console.warn("Disconnected!"); })
    .on("reconnecting", () => { console.warn("Reconnecting..."); })
    .on("commandError", (cmd, err) => {
        if(err instanceof Commando.FriendlyError) return;
        console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    })
    .on("commandBlocked", (msg, reason) => {
        console.log(`Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ""} blocked; ${reason}`);
    })
    .on("commandPrefixChange", (guild, prefix) => {
        console.log(`Prefix ${prefix === "" ? "removed" : `changed to ${prefix || "the default"}`} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.`);
    })
    .on("commandStatusChange", (guild, command, enabled) => {
        console.log(`Command ${command.groupID}:${command.memberName} ${enabled ? "enabled" : "disabled"} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.`);
    })
    .on("groupStatusChange", (guild, group, enabled) => {
        console.log(`Group ${group.id} ${enabled ? "enabled" : "disabled"} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.`);
    });


const AUTHENTICATE = false;

bot.on("guildMemberAdd", member => {
    if (!AUTHENTICATE) return;
    //member.send(`Hi! Welcome to this server! Log in to the bot with EVE here: `);
});

bot.login(process.env.DISCORD_TOKEN);
