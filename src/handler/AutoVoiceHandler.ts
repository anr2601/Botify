import { VoiceState, TextChannel, Client, ChannelType, PermissionFlagsBits } from "discord.js";

export class AutoVoiceHandler {
  private client: Client;
  private voiceLogChannelId: string;
  private voiceCallChannelId: string;

  constructor(client: Client) {
    this.client = client;
    this.voiceLogChannelId = process.env.VOICE_LOG_CHANNEL_ID || '';
    this.voiceCallChannelId = process.env.VOICE_CALL_CHANNEL_ID || '';
  }

  // Main handler for voice state changes
  public handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState): void {
    const voiceLogChannel = this.getVoiceLogChannel();

    if (oldState.channel) {
      this.handleLeave(oldState, voiceLogChannel);
    }

    if (newState.channelId === this.voiceCallChannelId) {
      this.handleJoin(newState, voiceLogChannel);
    }
  }

  // Handle when a user leaves a voice channel
  private async handleLeave(oldState: VoiceState, voiceLogChannel: TextChannel | null): Promise<void> {
    if (!oldState.channel || !oldState.channel.name.startsWith("*")) return;

    const username = oldState.member?.user.username;

    if (oldState.channel.members.size === 0) {
      try {
        await oldState.channel.delete("Temporary channel cleanup");
        voiceLogChannel?.send(`Deleted voice channel for ${username}!`);
      } catch (error) {
        console.error("Failed to delete channel", error);
      }
    }
  }

  // Handle when a user joins to create a new private voice channel
  private async handleJoin(newState: VoiceState, voiceLogChannel: TextChannel | null): Promise<void> {
    const guild = newState.guild;
    const everyone = guild.roles.everyone;
    const username = newState.member?.user.username;

    if (!username || !newState.channel) return;

    const newChannel = await guild.channels.create({
      name: `*${username}'s Inn`,
      type: ChannelType.GuildVoice,
      bitrate: newState.channel.bitrate || 64000,
      parent: newState.channel.parent,
      userLimit: 20,
      permissionOverwrites: [
        {
          id: everyone.id,
          allow: [PermissionFlagsBits.ViewChannel],
        },
      ],
    });

    newState.setChannel(newChannel);
    voiceLogChannel?.send(`Created new voice channel for ${username}!`);
  }

  // Get the voice log channel
  private getVoiceLogChannel(): TextChannel | null {
    return this.client.channels.cache.get(this.voiceLogChannelId) as TextChannel || null;
  }
}
