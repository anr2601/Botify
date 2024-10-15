import { Message, TextChannel } from "discord.js";

export class CountingGame {
  private counter: number;
  private magicalNumber: number;
  private countingChannelId: string;

  constructor(channelId: string) {
    this.counter = -1;
    this.magicalNumber = 5500; // Starting magical number
    this.countingChannelId = channelId;
  }

  private isPositiveInteger(str: string): boolean {
    const num = Number(str);
    return Number.isInteger(num) && num > 0;
  }

  public async handleMessage(message: Message): Promise<void> {
    const channel = message.channel as TextChannel;

    // Ensure the message is in the counting game channel
    if (message.channel.id !== this.countingChannelId) return;

    // Check if the message is a positive integer
    if (!this.isPositiveInteger(message.content)) {
      await this.sendErrorMessage(message, "You don't seem to be counting correctly! :P");
      return;
    }

    // Fetch the last two messages in the channel
    const messages = await channel.messages.fetch({ limit: 2 });
    const lastMessage = messages.last();
    let lastCount = this.counter !== -1 ? this.counter : parseInt(lastMessage?.content || "0");

    // Check if the number is incremented correctly
    if (lastCount + 1 !== parseInt(message.content)) {
      await this.sendErrorMessage(message, "You don't seem to be counting correctly! :P");
      return;
    }

    // Prevent the same user from sending consecutive messages
    if (lastMessage && lastMessage.author.id === message.author.id) {
      await this.sendErrorMessage(message, "You cannot keep counting by yourself! :P");
      return;
    }

    this.counter = lastCount + 1;

    // Handle reaching the magical number
    if (parseInt(message.content) === this.magicalNumber) {
      await channel.send(
        `<@${message.author.id}> Congratulations! You have counted to a surprise number! 🎉`
      );
      this.incrementMagicalNumber();
    }
  }

  private async sendErrorMessage(message: Message, errorMessage: string): Promise<void> {
    const channel = message.channel as TextChannel;
    const errorMsg = await channel.send(`<@${message.author.id}> ${errorMessage}`);
    setTimeout(() => errorMsg.delete(), 3000);
    await message.delete();
  }

  private incrementMagicalNumber(): void {
    const increaseBy = Math.floor(Math.random() * 101) + 200;
    this.magicalNumber += increaseBy;
  }
}
