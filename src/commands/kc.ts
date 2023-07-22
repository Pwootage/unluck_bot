import { Pagination } from "@discordx/pagination";
import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Discord, MetadataStorage, Slash, SlashOption } from "discordx";
import { HighscorePlayer, OSRSActivities, getHighscores } from "../rsapi/highscores.js";

@Discord()
export class KcCommand {
  // example: pagination for all slash command
  @Slash({
    description: "Check kill count",
    name: "kc",
  })
  async kc(
    @SlashOption({
      description: "What to check",
      name: "what",
      required: true,
      autocomplete(interaction, command) {
        const query = interaction.options.getFocused(true).value
          .toLowerCase();
        interaction.respond(
          OSRSActivities
            .filter(a => a.toLowerCase().includes(query))
            .slice(0, 25)
            .map(a => ({ name: a, value: a }))
        );
      },
      type: ApplicationCommandOptionType.String,
    })
    what: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const people = [
      "silverilk",
      "vonschattn",
      "glotatochip",
      "roktavious",
      "grpalan",
    ];

    const name = OSRSActivities.find((a) => a.toLowerCase() === what.toLowerCase());
    if (!name) {
      await interaction.reply({
        content: `Unknown activity ${what}`,
        ephemeral: true,
      });
      return;
    }
    const hs = await Promise.all(
      people.map(p => getHighscores(p)
        .then<[string, number]>(s => [p, s.activities[name.toLowerCase()].xp]))
    );
    const count = hs.reduce((acc, [p, curr]) => acc + curr, 0);

    let pCounts = hs.map(([p, curr]) => `${p}: ${curr}`).join(", ");
    let msg = `${name} total KC: ${count} (${pCounts})`;

    interaction.reply({
      content: msg,
    });
  }
  // async pages(interaction: CommandInteraction): Promise<void> {
  //   const commands = MetadataStorage.instance.applicationCommands.map((cmd) => {
  //     return { description: cmd?.description, name: cmd.name };
  //   });

  //   const pages = commands.map((cmd, i) => {
  //     const embed = new EmbedBuilder()
  //       .setFooter({ text: `Page ${i + 1} of ${commands.length}` })
  //       .setTitle("**Slash command info**")
  //       .addFields({ name: "Name", value: cmd.name })
  //       .addFields({
  //         name: "Description",
  //         value: `${
  //           cmd.description.length > 0
  //             ? cmd.description
  //             : "Description unavailable"
  //         }`,
  //       });

  //     return { embeds: [embed] };
  //   });

  //   const pagination = new Pagination(interaction, pages);
  //   await pagination.send();
  // }
}
