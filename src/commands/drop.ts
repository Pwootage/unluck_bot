import { Pagination } from "@discordx/pagination";
import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Discord, MetadataStorage, Slash, SlashOption } from "discordx";
import { HighscorePlayer, OSRSActivities, OSRSActivityData, getHighscores } from "../rsapi/highscores.js";

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(2)}%`;
}

function binomial(n: number, k: number): number {
  let coeff = 1;
  for (let x = n - k + 1; x <= n; x++) coeff *= x;
  for (let x = 1; x <= k; x++) coeff /= x;
  return coeff;
}

function probability(p: number, n: number, k: number) {
  return binomial(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

@Discord()
export class DropCommand {
  // example: pagination for all slash command
  @Slash({
    description: "Drop %",
    name: "drop",
  })
  async drop(
    @SlashOption({
      description: "Drop rate 1/<x> e.g. 400 for 1/400",
      name: "droprate",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    droprate: number,
    @SlashOption({
      description: "Kill count",
      name: "kc",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    })
    kc: number,
    interaction: CommandInteraction
  ): Promise<void> {
    let p = 1/droprate;
    let p0 = probability(p, kc, 0);
    let p1 = probability(p, kc, 1);
    let p2 = probability(p, kc, 2);
    // let p3 = probability(p, cgEquiv, 3);


    let msg = `Chance of drop: ${fmtPct(1 - p0)}`;
    msg += `\nChance of getting at least two: ${fmtPct(1 - p1 - p0)}`;
    msg += `\nChance of getting at least three: ${fmtPct(1 - p2 - p1 - p0)}`;

    interaction.reply({
      content: msg,
    });
  }
}
