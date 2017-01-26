import {Client, Message} from "discord.js";
import {CommandContext} from "../";

export default function({bot, message, sanitized, sde}: CommandContext) {
    const prefix = "link ";
    if (sanitized.startsWith(prefix)) {
        const searchText = sanitized.substring(0, sanitized.length - prefix.length);
        
    }
}