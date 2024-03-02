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
export class BlowpipeCommand {
  @Slash({
    description: "Blowpipe %",
    name: "blowpipe",
  })
  async blowpipe(
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
    const count = hs.reduce((acc, [p, curr]) => acc + curr.activities['zulrah'].xp, 0);

    let p = 1/1024;
    let p0 = probability(p, count * 2, 0);
    let p1 = probability(p, count * 2, 1);
    let p2 = probability(p, count * 2, 2);
    // let p3 = probability(p, cgEquiv, 3);


    let msg = `Chance of having a blowpipe: ${fmtPct(1 - p0)} (kc ${count}, drops ${count * 2})`;
    msg += `\nChance of getting at least two: ${fmtPct(1 - p1 - p0)}`;
    msg += `\nChance of getting at least three: ${fmtPct(1 - p2 - p1 - p0)}`;


    interaction.reply({
      content: msg,
    });
  }
}
