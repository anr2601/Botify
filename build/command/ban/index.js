"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanCommand = void 0;
const discord_js_1 = require("discord.js");
class BanCommand {
    constructor() {
        this.name = "ban";
        this.description = "Bans a user from the server";
        this.slashCommandConfig = new discord_js_1.SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option => option.setName("target")
            .setDescription("The user to ban")
            .setRequired(true))
            .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers); // Restricts the command to users with Ban permission
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const target = interaction.options.getUser("target");
            const member = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get((_b = target === null || target === void 0 ? void 0 : target.id) !== null && _b !== void 0 ? _b : '');
            if (member) {
                yield member.ban();
                yield interaction.reply(`${target === null || target === void 0 ? void 0 : target.tag} has been banned.`);
            }
            else {
                yield interaction.reply(`Failed to ban the user.`);
            }
        });
    }
}
exports.BanCommand = BanCommand;
