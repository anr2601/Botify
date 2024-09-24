import { ChatInputCommandInteraction, CacheType, SlashCommandBuilder } from 'discord.js';
import { Command } from '../..';
import { DailyClaimModel } from '../../../models/User'; // Your model file path
import mongoose from 'mongoose';

export class DailyCommand implements Command {
  name = 'daily';
  description = 'Claim your daily reward!';
  slashCommandConfig: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);

  async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<any> {
    const userId = interaction.user.id;
    const now = new Date();

    try {
      // Find the user's last claim record
      let userClaim = await DailyClaimModel.findOne({ userId });

      // If the user has a record and claimed within the last 24 hours
      if (userClaim && now.getTime() - userClaim.lastClaim.getTime() < 24 * 60 * 60 * 1000) {
        const hoursRemaining = Math.ceil((24 * 60 * 60 * 1000 - (now.getTime() - userClaim.lastClaim.getTime())) / (60 * 60 * 1000));
        return interaction.reply({ content: `You have already claimed your daily reward! Try again in ${hoursRemaining} hour(s).`, ephemeral: true });
      }

      // If no record, or if more than 24 hours have passed, update or create a record
      if (!userClaim) {
        userClaim = new DailyClaimModel({
          userId,
          lastClaim: now,
        });
      } else {
        userClaim.lastClaim = now;
      }

      await userClaim.save();

      // Grant the daily reward
      return interaction.reply({ content: `You have successfully claimed your daily reward!`, ephemeral: true });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'An error occurred while claiming your daily reward. Please try again later.', ephemeral: true });
    }
  }
}
