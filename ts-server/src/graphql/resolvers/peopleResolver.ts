import { MercuriusContext } from "mercurius";
import { withContext } from ".";
import { Character } from "./Person";

export const Person = {
  homeworld: (person: Character, _args: unknown, cxt: MercuriusContext) =>
    withContext(cxt, async (context) =>
      context.prisma.starwars_planet.findUnique({
        where: { id: person.homeworld_id },
      })
    ),

  species: (person: Character, _args: unknown, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const speciesPeople =
        await context.prisma.starwars_species_people.findMany({
          where: { people_id: person.id },
        });
      const speciesIds = speciesPeople.map((ids) => ids.species_id);
      return context.prisma.starwars_species.findMany({
        where: { id: { in: speciesIds } },
      });
    }),
};
