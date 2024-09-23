"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const handler_1 = require("./handler");
dotenv_1.default.config();
const DISCORD_ACCESS_TOKEN = process.env.DISCORD_TOKEN || "";
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
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
        this.discordRestClient = new discord_js_1.REST().setToken(DISCORD_ACCESS_TOKEN);
        this.interactionHandler = new handler_1.InteractionHandler();
    }
    start() {
        this.client
            .login(DISCORD_ACCESS_TOKEN)
            .then(() => {
            this.addClientEventHandlers();
            this.registerSlashCommands();
        })
            .catch((err) => console.error("Error starting bot", err));
    }
    registerSlashCommands() {
        const commands = this.interactionHandler.getSlashCommands();
        this.discordRestClient
            .put(discord_js_1.Routes.applicationCommands(DISCORD_CLIENT_ID), {
            body: commands,
        })
            .then((data) => {
            console.log(`Successfully registered ${data.length} global application (/) commands`);
        })
            .catch((err) => {
            console.error("Error registering application (/) commands", err);
        });
    }
    addClientEventHandlers() {
        this.client.on(discord_js_1.Events.InteractionCreate, (interaction) => {
            this.interactionHandler.handleInteraction(interaction);
        });
        this.client.on(discord_js_1.Events.ClientReady, () => {
            console.log("Botify client logged in");
        });
        this.client.on(discord_js_1.Events.Error, (err) => {
            console.error("Client error", err);
        });
    }
}
const app = new BotifyApplication();
app.start();
