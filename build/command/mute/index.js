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
exports.MuteCommand = void 0;
const discord_js_1 = require("discord.js");
class MuteCommand {
    constructor() {
        this.name = "mute";
        this.description = "Mutes a user in the server";
        this.slashCommandConfig = new discord_js_1.SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option => option.setName("target")
            .setDescription("The user to mute")
            .setRequired(true))
            .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.MuteMembers); // <-- Type Assertion Here
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const target = interaction.options.getUser("target");
            const member = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get((_b = target === null || target === void 0 ? void 0 : target.id) !== null && _b !== void 0 ? _b : '');
            const muteRole = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find(role => role.name === 'Muted');
            if (member && muteRole) {
                yield member.roles.add(muteRole);
                yield interaction.reply(`${target === null || target === void 0 ? void 0 : target.tag} has been muted.`);
            }
            else {
                yield interaction.reply(`User not found or mute role not set up.`);
            }
        });
    }
}
exports.MuteCommand = MuteCommand;
