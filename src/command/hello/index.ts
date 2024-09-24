import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { Command } from "..";
  
  export class HelloCommand implements Command {
    name = "hey";
    description = "Greets the bot";
    slashCommandConfig = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  
    async execute(
      interaction: ChatInputCommandInteraction<CacheType>
    ): Promise<any> {
      return interaction.reply("Hey!");
    }
  }