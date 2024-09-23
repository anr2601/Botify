import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "../command";
import { PingCommand } from "../command/ping";
import {HelloCommand} from "../command/hello"

export class InteractionHandler {
  private commands: Command[];

    constructor() {
      this.commands = [
        new PingCommand(),
        new HelloCommand()
      ];
    }
  

  getSlashCommands() {
    return this.commands.map((command: Command) =>
      command.slashCommandConfig.toJSON()
    );
  }

  async handleInteraction(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
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
      .catch((err) =>
        console.log(
          `Error executing command [/${interaction.commandName}]: ${err}`,
          {
            guild: interaction.guild
              ? { id: interaction.guildId, name: interaction.guild.name }
              : { id: "DM", name: "Direct Message" }, // Handle the case where interaction.guild is null
            user: { name: interaction.user.globalName },
          }
        )
      );
  }
}