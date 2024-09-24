import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import { Command } from "..";
const questionsData = require('../../../wyr.json')


export class WYRCommand implements Command {

    name = "wyr-game";
    description = "Plays a game of 'Would You Rather?'";

    slashCommandConfig = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description) // <-- Type Assertion Here
  
    async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<any> {

        const randomQuestion = questionsData.questions[Math.floor(Math.random() * questionsData.questions.length)];

        const oneButton = new ButtonBuilder()
        .setCustomId('oneButton')
        .setLabel(randomQuestion.button1)
        .setStyle(ButtonStyle.Secondary)
        
        const twoButton = new ButtonBuilder()
        .setCustomId('twoButton')
        .setLabel(randomQuestion.button2)
        .setStyle(ButtonStyle.Secondary)

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(oneButton, twoButton);

        const embed  = new EmbedBuilder()
            .setTitle("Would You Rather?")
            .setColor('Blue')
            .setTimestamp()
            .setFooter({text: `Started By: ${interaction.user.username}` })
            .addFields(
                {name: `\u2003`, value:`\u2003`}, //adds spacing
                {name: `Question One:`, value:`\`\`\`${randomQuestion.option1}\`\`\``},
                {name: `\u2003`, value:`\u2003`}, //adds spacing
                {name: `Question Two:`, value:`\`\`\`${randomQuestion.option2}\`\`\``}
            );

            await interaction.reply({embeds:[embed], components:[row] })
    }
  }
  