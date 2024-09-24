import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, PermissionFlagsBits } from "discord.js";
  import { Command } from "../..";


  export class BanCommand implements Command {
    name = "ban";
    description = "Bans a user from the server";
    //devOnly = Boolean;
    //testOnly = Boolean;
    slashCommandConfig = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addUserOption(option =>
        option.setName("target")
          .setDescription("The user to ban")
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) as SlashCommandBuilder; // Restricts the command to users with Ban permission
  
    async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<any> {
      

      if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({ content: 'You do not have the permission to use this command.', ephemeral: true });
      }

      const target = interaction.options.getUser("target");
      const member = interaction.guild?.members.cache.get(target?.id ?? '');
      
      if (member) {
        await member.ban();
        await interaction.reply(`${target?.tag} has been banned.`);
      } else {
        await interaction.reply(`Failed to ban the user.`);
      }
    }
  }