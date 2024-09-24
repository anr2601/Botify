import { ChatInputCommandInteraction, CacheType, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../..'; // Assuming you have the Command interface already

export class TimeoutCommand implements Command {
  name = 'timeout';
  description = 'Temporarily restricts a user from interacting in the server';
  slashCommandConfig: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to timeout')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Timeout duration in minutes')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers) as SlashCommandBuilder; // This ensures only members with timeout permissions can use the command

  async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<any> {
    const target = interaction.options.getUser('target');
    const duration = interaction.options.getInteger('duration');

    if (!target || !duration) {
      return interaction.reply({ content: 'Invalid user or duration specified.', ephemeral: true });
    }

    const member = interaction.guild?.members.cache.get(target.id);
    const timeoutDuration = duration * 60 * 1000; // Convert minutes to milliseconds

    if (!member) {
      return interaction.reply({ content: 'User not found in the server.', ephemeral: true });
    }

    try {
      // Timeout the user for the specified duration
      await member.timeout(timeoutDuration);
      return interaction.reply(`${target.tag} has been timed out for ${duration} minute(s).`);
    } catch (error) {
      console.error('Failed to timeout user:', error);
      return interaction.reply({ content: `Failed to timeout ${target.tag}.`, ephemeral: true });
    }
  }
}
