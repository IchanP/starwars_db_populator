import { MercuriusContext } from "mercurius";
import { Specie } from "./Species";
import { withContext } from ".";

export const Species = {
  homeworld: (species: Specie, _args: unknown, cxt: MercuriusContext) => {
    if (!species.homeworld_id) return;
    return withContext(cxt, async (context) =>
      context.prisma.starwars_planet.findUnique({
        where: { id: Number(species.homeworld_id) },
      })
    );
  },

  people: (species: Specie, _args: unknown, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const speciesPeople =
        await context.prisma.starwars_species_people.findMany({
          where: { species_id: species.id },
          include: {
            starwars_people: true,
          },
        });
      return speciesPeople.map((people) => people.starwars_people);
    }),
};
