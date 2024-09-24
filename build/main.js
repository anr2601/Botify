"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose = require('mongoose');
const handler_1 = require("./handler");
dotenv_1.default.config();
const DISCORD_ACCESS_TOKEN = process.env.DISCORD_TOKEN || "";
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
class BotifyApplication {
    constructor() {
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMembers,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.MessageContent,
            ],
            shards: "auto",
            failIfNotExists: false,
        });
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                mongoose.set('strictQuery', false);
                yield mongoose.connect(process.env.MONGO_URL);
                console.log("Connected to MongoDB");
            }
            catch (error) {
                console.log(`Error: ${error}`);
            }
        }))();
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
        this.client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isButton())
                return;
            if (interaction.customId === 'oneButton') {
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(`${interaction.user.username} voted for 1`)
                    .setColor('Blue')
                    .setTimestamp()
                    .setFooter({ text: `Voted for option 1` });
                if (!interaction.channel) {
                    return yield interaction.reply({
                        content: 'This interaction cannot be processed in DMs.',
                        ephemeral: true,
                    });
                }
                const channel = interaction.channel;
                if (channel && (channel instanceof discord_js_1.TextChannel || channel instanceof discord_js_1.DMChannel || channel instanceof discord_js_1.NewsChannel)) {
                    const reaction = yield channel.send({ embeds: [embed] });
                    reaction.react('👍');
                    reaction.react('👎');
                    yield interaction.reply({ content: "Successfully Voted", ephemeral: true });
                }
                else {
                    // Handle the case where the channel does not support sending messages
                    console.error('The channel type does not support sending messages.');
                }
            }
            else if (interaction.customId === 'twoButton') {
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(`${interaction.user.username} voted for 2`)
                    .setColor('Blue')
                    .setTimestamp()
                    .setFooter({ text: `Voted for option 2` });
                if (!interaction.channel) {
                    return yield interaction.reply({
                        content: 'This interaction cannot be processed in DMs.',
                        ephemeral: true,
                    });
                }
                const channel = interaction.channel;
                if (channel && (channel instanceof discord_js_1.TextChannel || channel instanceof discord_js_1.DMChannel || channel instanceof discord_js_1.NewsChannel)) {
                    const reaction = yield channel.send({ embeds: [embed] });
                    reaction.react('👍');
                    reaction.react('👎');
                    yield interaction.reply({ content: "Successfully Voted", ephemeral: true });
                }
                else {
                    // Handle the case where the channel does not support sending messages
                    console.error('The channel type does not support sending messages.');
                }
            }
        }));
        this.client.on(discord_js_1.Events.ClientReady, () => {
            console.log("Botify client logged in");
            setInterval(() => {
                var _a;
                let status = [
                    {
                        name: 'Minecraft',
                        type: discord_js_1.ActivityType.Playing
                    },
                    {
                        name: 'Youtube',
                        type: discord_js_1.ActivityType.Watching
                    },
                    {
                        name: 'React Chatbotify Documentation',
                        type: discord_js_1.ActivityType.Watching
                    },
                    {
                        name: 'Spotify',
                        type: discord_js_1.ActivityType.Listening
                    }
                ];
                let random = Math.floor(Math.random() * status.length);
                (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.setActivity(status[random]);
            }, 100000);
        });
        this.client.on(discord_js_1.Events.Error, (err) => {
            console.error("Client error", err);
        });
    }
}
const app = new BotifyApplication();
app.start();
