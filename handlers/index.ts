import {Client, Message} from "discord.js";
import {readdirSync} from "fs";
import {CommandContext} from "../";

export interface CommandHandler {
    default: (context: CommandContext) => void;
}

const commands = readdirSync(__dirname)
    .filter(filename => filename !== "index.ts" && filename.endsWith(".ts"))
    .map(filename => [filename.substring(0, filename.length - 3), require(`./${filename}`)]) as [string, CommandHandler][];

export default async (context: CommandContext) => {
    for (const [command, handles] of commands) {
        await handles.default(context);
    }
};