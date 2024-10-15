import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { Command } from "..";
import { CountingGame } from "../../Games/counting"; // Import your CountingGame class
import dotenv from "dotenv";

export class CountingGameCommand implements Command {
  name = "resetcg"; // Command name
  description = "Resets the counting game counter.";
  slashCommandConfig = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);

  private countingGame: CountingGame;

  constructor(channelId: string) {
    this.countingGame = new CountingGame(channelId); // Initialize CountingGame
  }

  async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<any> {
    this.countingGame.resetCounter(); // Reset the counter
    return interaction.reply("The counting game counter has been reset!");
  }
}