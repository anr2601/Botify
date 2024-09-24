import { ChatInputCommandInteraction, CacheType, SlashCommandBuilder } from 'discord.js';
import { Command } from '../..';
import { DailyClaimModel } from '../../../models/User'

export class BalanceCommand implements Command {
  name = 'balance';
  description = 'Check your current balance!';
  slashCommandConfig: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);

  async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<any> {
    const userId = interaction.user.id;

    try {
      // Find the user in the database
      const userClaim = await DailyClaimModel.findOne({ userId });

      if (!userClaim) {
        return interaction.reply({ content: `You don't have a balance yet! Claim your daily reward first!`, ephemeral: true });
      }

      // Reply with the user's balance
      return interaction.reply({ content: `Your current balance is: ${userClaim.balance} coins.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'An error occurred while fetching your balance. Please try again later.', ephemeral: true });
    }
  }
}
