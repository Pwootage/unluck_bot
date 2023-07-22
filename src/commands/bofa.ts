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
export class BofaCommand {
  // example: pagination for all slash command
  @Slash({
    description: "Bofa %",
    name: "bofa",
  })
  async bofa(
    interaction: CommandInteraction
  ): Promise<void> {
    const people = [
      "silverilk",
      "vonschattn",
      "glotatochip",
      "roktavious",
      "grpalan",
    ];

    const hs = await Promise.all(
      people.map(p => getHighscores(p)
        .then<[string, HighscorePlayer]>(s => [p, s]))
    );
    const countRegular = hs.reduce((acc, [p, curr]) => acc + curr.activities['the gauntlet'].xp, 0);
    const countCorrupted = hs.reduce((acc, [p, curr]) => acc + curr.activities['the corrupted gauntlet'].xp, 0);
    const cgEquiv = countCorrupted + Math.floor(countRegular / 5);

    // const regRate = 1 - Math.pow(1 - (1 / 2000), countRegular);
    // const cgRate = 1 - Math.pow(1 - (1 / 400), countCorrupted);
    // const cgEquivRate = 1 - Math.pow(1 - (1 / 400), cgEquiv);

    let p = 1/400;
    let p0 = probability(p, cgEquiv, 0);
    let p1 = probability(p, cgEquiv, 1);
    let p2 = probability(p, cgEquiv, 2);
    // let p3 = probability(p, cgEquiv, 3);


    let msg = `Chance of having bofa: ${fmtPct(1 - p0)} (cg equiv: ${cgEquiv})`;
    msg += `\nChance of getting at least two: ${fmtPct(1 - p1 - p0)}`;
    msg += `\nChance of getting at least three: ${fmtPct(1 - p2 - p1 - p0)}`;


    interaction.reply({
      content: msg,
    });
  }
}
