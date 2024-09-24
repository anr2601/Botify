import { ChatInputCommandInteraction, Client, Events, GatewayIntentBits, REST as DiscordRestClient, Routes, ActivityType, EmbedBuilder, TextChannel, DMChannel, NewsChannel } from "discord.js";
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
          mongoose.set('strictQuery', false);
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

      this.client.on(Events.InteractionCreate, async interaction => {

        if(!interaction.isButton()) return;
        if(interaction.customId === 'oneButton'){
          
          const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username} voted for 1`)
            .setColor('Blue')
            .setTimestamp()
            .setFooter({text:`Voted for option 1`})


          if (!interaction.channel) {
            return await interaction.reply({
              content: 'This interaction cannot be processed in DMs.',
              ephemeral: true,
            });
          }

          const channel = interaction.channel;

          if (channel && (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel)) {
            const reaction = await channel.send({embeds:[embed]});
            reaction.react('👍')
            reaction.react('👎')
            await interaction.reply({content:"Successfully Voted", ephemeral:true});
          }
          else {
            // Handle the case where the channel does not support sending messages
            console.error('The channel type does not support sending messages.');
          }

        }
        else if(interaction.customId === 'twoButton'){
          
          const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username} voted for 2`)
            .setColor('Blue')
            .setTimestamp()
            .setFooter({text:`Voted for option 2`})


          if (!interaction.channel) {
            return await interaction.reply({
              content: 'This interaction cannot be processed in DMs.',
              ephemeral: true,
            });
          }

          const channel = interaction.channel;

          if (channel && (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel)) {
            const reaction = await channel.send({embeds:[embed]});
            reaction.react('👍')
            reaction.react('👎')
            await interaction.reply({content:"Successfully Voted", ephemeral:true});
          }
          else {
            // Handle the case where the channel does not support sending messages
            console.error('The channel type does not support sending messages.');
          }

        }
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
        }, 100000);
      });
  
      this.client.on(Events.Error, (err: Error) => {
        console.error("Client error", err);
      });
    }
  }
  
  const app = new BotifyApplication();
  app.start();