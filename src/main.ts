import { ChatInputCommandInteraction, Client, Events, GatewayIntentBits, REST as DiscordRestClient, Routes, ActivityType, EmbedBuilder, ChannelType, TextChannel, DMChannel, NewsChannel, VoiceState } from "discord.js";
  import dotenv from "dotenv";
  const mongoose = require('mongoose');
  import { InteractionHandler } from "./handler/Slash";
  import { AutoVoiceHandler } from "./handler/AutoVoiceHandler";
  import { CountingGame } from "./Games/counting";
  dotenv.config();

  
  //ENV VARS
  const DISCORD_ACCESS_TOKEN = process.env.DISCORD_TOKEN || "";
  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
  const COUNTINGGAME_ID = process.env.COUNTING_GAME_ID || "";


  //---------------------------------------------------BOTIFY CLASS----------------------------------------------------------
  
  class BotifyApplication {

    private client: Client;
    private discordRestClient: DiscordRestClient;
    private interactionHandler: InteractionHandler;
    private autoVoiceHandler: AutoVoiceHandler;
    private countinggame: CountingGame;
  
    constructor() {
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildVoiceStates,
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
      this.autoVoiceHandler = new AutoVoiceHandler(this.client);
      this.countinggame = new CountingGame(COUNTINGGAME_ID);
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



    //---------------------------------------------------------EVENT HANDLERS----------------------------------------------------------------
  
    addClientEventHandlers() {

      this.client.on(Events.InteractionCreate, (interaction) => {
        this.interactionHandler.handleInteraction(
          interaction as ChatInputCommandInteraction
        );
      });


      // AUTO VOICE CHANNEL EVENT
      this.client.on(Events.VoiceStateUpdate, (oldState, newState) => {
        this.autoVoiceHandler.handleVoiceStateUpdate(oldState, newState); // Add event for voice state updates
      });



      // WOULD YOU RATHER GAME EVENT

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

      // MESSAGE EVENT FOR COUNTING GAME
      this.client.on(Events.MessageCreate, async (message) => {
        // Ignore messages from bots
        if (message.author.bot) return;

        // Handle counting game messages
        if (message.channel.id === COUNTINGGAME_ID) {
          await this.countinggame.handleMessage(message);
        }
      });

      // COUNTING GAME

      this.client.on(Events.InteractionCreate, async interaction => {
        if (interaction.isCommand()) {
          if (interaction.commandName === 'resetcounter') {
            this.countinggame.resetCounter(); // Reset the counter
            await interaction.reply({ content: 'The counting game counter has been reset!', ephemeral: true });
          }
        }
      });


      // BOT PERSONAL ENTERTAINMENT EVENTS
  
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