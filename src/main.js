"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DISCORD_ACCESS_TOKEN = process.env.DISCORD_TOKEN || "";
class BotifyApplication {
    constructor() {
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.MessageContent,
            ],
            shards: "auto",
            failIfNotExists: false,
        });
    }
    addClientEventHandlers() {
        this.client.on(discord_js_1.Events.MessageCreate, (message) => {
            const { content } = message;
            message.reply(`Serenity Bot says: ${content}`);
        });
        this.client.on(discord_js_1.Events.ClientReady, () => {
            console.log("Serenity bot client logged in");
        });
        this.client.on(discord_js_1.Events.Error, (err) => {
            console.error("Client error", err);
        });
    }
    startBot() {
        this.client
            .login(DISCORD_ACCESS_TOKEN)
            .then(() => {
            this.addClientEventHandlers();
        })
            .catch((err) => {
            console.error("Error starting bot", err);
        });
    }
}
const app = new BotifyApplication();
app.startBot();
