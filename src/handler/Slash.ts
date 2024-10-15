import { ChatInputCommandInteraction, ButtonInteraction, CacheType, Guild, Interaction } from "discord.js";
import { Command } from "../command";
import { PingCommand } from "../command/ping";
import {HelloCommand} from "../command/hello";
import { BanCommand } from "../command/moderation/ban";
import { MuteCommand } from "../command/moderation/mute";
import { TimeoutCommand } from '../command/moderation/timeout';
import { DailyCommand } from "../command/economy/daily";
import { WYRCommand } from "../command/game";
import { CountingGameCommand } from "../command/cggame";
import dotenv from "dotenv"

dotenv.config()
const COUNTINGGAME_ID = process.env.COUNTING_GAME_ID || "";


export class InteractionHandler {
  private commands: Command[];

    constructor() {
      this.commands = [
        new PingCommand(),
        new HelloCommand(),
        new BanCommand(),
        new MuteCommand(),
        new TimeoutCommand(),
        new DailyCommand(),
        new WYRCommand(),
        new CountingGameCommand(COUNTINGGAME_ID), 
      ];
    }
  
    
  getSlashCommands() {
    return this.commands.map((command: Command) =>
      command.slashCommandConfig.toJSON()
    );
  }

  async handleInteraction(
    interaction: Interaction
  ): Promise<void> {

    try{
      if (interaction.isChatInputCommand()) {
          const commandName = interaction.commandName;

          const matchedCommand = this.commands.find(
            (command) => command.name === commandName
          );

          if (!matchedCommand) {
            return Promise.reject("Command not matched");
          }

          

          matchedCommand
            .execute(interaction)
            .then(() => {
              console.log(
                `Sucesfully executed command [/${interaction.commandName}]`,
                {
                  guild: interaction.guild
                    ? { id: interaction.guildId, name: interaction.guild.name }
                    : { id: "DM", name: "Direct Message" }, // Handle the case where interaction.guild is null
                  user: { name: interaction.user.globalName },
                }
              );
            })
        }
        else if (interaction.isButton()) {
          // Handle button interactions from the WYR game
          await this.handleButtonInteraction(interaction as ButtonInteraction);
        }
      }
      catch(err) {
        console.error(`Error executing command [/${interaction.isChatInputCommand() ? interaction.commandName : 'Button'}]: ${err}`, {
          guild: interaction.guild
            ? { id: interaction.guildId, name: interaction.guild.name }
            : { id: "DM", name: "Direct Message" },
          user: { name: interaction.user.username },
        });
  };
  }


  

  //WOULD YOU RATHER GAME HANDLER
  async handleButtonInteraction(interaction: ButtonInteraction): Promise<void> {
    // Handle different button interactions from the "Would You Rather" game
    const customId = interaction.customId;

    if (customId === 'oneButton') {
      await interaction.reply({ content: 'You chose the first option!', ephemeral: true });
    } else if (customId === 'twoButton') {
      await interaction.reply({ content: 'You chose the second option!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Unknown button interaction.', ephemeral: true });
    }

    console.log(`Button clicked: ${customId}`, {
      guild: interaction.guild
        ? { id: interaction.guildId, name: interaction.guild.name }
        : { id: "DM", name: "Direct Message" },
      user: { name: interaction.user.username },
    });
  }
}