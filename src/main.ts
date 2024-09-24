import { ChatInputCommandInteraction, Client, Events, GatewayIntentBits, REST as DiscordRestClient, Routes, ActivityType } from "discord.js";
  import dotenv from "dotenv";
  const mongoose = require('mongoose');
  import { InteractionHandler } from "./handler";
  dotenv.config();

  
  const DISCORD_ACCESS_TOKEN = process.env.DISCORD_TOKEN || "";
  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
  
  class BotifyApplication {
    private client: Client;
    private discordRestClient: DiscordRestClient;
    private interactionHandler: InteractionHandler;
  
    constructor() {
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
        shards: "auto",
        failIfNotExists: false,
      });

      (async() => {
        
        try{
          await mongoose.connect(process.env.MONGO_URL);
          console.log("Connected to MongoDB");
        }
        catch(error){
          console.log(`Error: ${error}`);
        }
        
      })();

      this.discordRestClient = new DiscordRestClient().setToken(
        DISCORD_ACCESS_TOKEN
      );
      this.interactionHandler = new InteractionHandler();
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
        .put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
          body: commands,
        })
        .then((data: any) => {
          console.log(
            `Successfully registered ${data.length} global application (/) commands`
          );
        })
        .catch((err) => {
          console.error("Error registering application (/) commands", err);
        });
    }
  
    addClientEventHandlers() {
      this.client.on(Events.InteractionCreate, (interaction) => {
        this.interactionHandler.handleInteraction(
          interaction as ChatInputCommandInteraction
        );
      });
  
      this.client.on(Events.ClientReady, () => {
        console.log("Botify client logged in");

        setInterval(() => {

          let status = [
            {
              name:'Minecraft',
              type:ActivityType.Playing
            },
            {
              name:'Youtube',
              type:ActivityType.Watching
            },
            {
              name:'React Chatbotify Documentation',
              type:ActivityType.Watching
            },
            {
              name:'Spotify',
              type:ActivityType.Listening
            }
          ]

          let random = Math.floor(Math.random() * status.length);
          this.client.user?.setActivity(status[random]);
        }, 10000);
      });
  
      this.client.on(Events.Error, (err: Error) => {
        console.error("Client error", err);
      });
    }
  }
  
  const app = new BotifyApplication();
  app.start();