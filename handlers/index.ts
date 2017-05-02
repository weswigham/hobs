import {Client, Message} from "discord.js";
import {readdirSync} from "fs";
import {CommandContext} from "../";

export interface CommandHandler {
    default: (context: CommandContext) => void;
    usage?: string;
    short?: string;
    detail?: string;
}

const commands = readdirSync(__dirname)
    .filter(filename => filename !== "index.ts" && filename.endsWith(".ts"))
    .map(filename => [filename.substring(0, filename.length - 3), require(`./${filename}`)]) as [string, CommandHandler][];


const helpCommand = {
    default: async (context: CommandContext) => {
        const prefix = "help";
        if (!context.sanitized.startsWith(prefix)) {
            return;
        }
        
        const subcommand = context.sanitized.substring(prefix.length).trim();
        if (subcommand && subcommand.length) {
            for (const [command, handles] of commands) {
                if (subcommand === command) {
                    let text = command;
                    if (handles.usage) {
                        text += ` ${handles.usage}`;
                    }
                    if (handles.short) {
                        text += ` - _${handles.short}_`;
                    }
                    if (handles.detail) {
                        text += `
${handles.detail}`;
                    }
                    if (!handles.usage && !handles.short && !handles.detail) {
                        text += ` - _No help provided_`;
                    }
                    text += "\n";
                    await context.message.author.send(text);
                    return;
                }
            }
            await context.message.author.send(`Command _${subcommand}_ does not exist.`);
            return;
        }
        let text = "";
        for (const [command, handles] of commands) {
            text += command;
            if (handles.usage) {
                text += ` ${handles.usage}`;
            }
            if (handles.short) {
                text += ` - _${handles.short}_`;
            }
            text += "\n";
        }
        await context.message.author.send(text);
    },
    usage: "[command]",
    short: "prints this help text or detailed help for a command",
    detail: ""
}

commands.push(["help", helpCommand]);


export default async (context: CommandContext) => {
    for (const [command, handles] of commands) {
        await handles.default(context);
    }
};