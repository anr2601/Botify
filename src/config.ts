import dotenv from 'dotenv'
dotenv.config()

export const CONFIG = {
    money: process.env.DISCORD_MONEY,
    counting: process.env.DISCORD_COUNTING,
    story: process.env.DISCORD_STORY,
    lobby: process.env.DISCORD_LOBBY
  };
  