import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, PermissionFlagsBits } from "discord.js";
import { Command } from "../..";


export class MuteCommand implements Command {
    name = "mute";
    description = "Mutes a user in the server";
    slashCommandConfig = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addUserOption(option =>
        option.setName("target")
          .setDescription("The user to mute")
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers) as SlashCommandBuilder; // <-- Type Assertion Here
  
    async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<any> {


      if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({ content: 'You do not have the permission to use this command.', ephemeral: true });
      }
      
      const target = interaction.options.getUser("target");
      const member = interaction.guild?.members.cache.get(target?.id ?? '');
      const muteRole = interaction.guild?.roles.cache.find(role => role.name === 'Muted');
  
      if (member && muteRole) {
        await member.roles.add(muteRole);
        await interaction.reply(`${target?.tag} has been muted.`);
      } else {
        await interaction.reply(`User not found or mute role not set up.`);
      }
    }
  }
  