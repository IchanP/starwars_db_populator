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
          include: {
            starwars_species: true,
          },
        });

      return speciesPeople.map(
        (species: SpeciesPerson) => species.starwars_species
      );
    }),
};

interface SpeciesPerson {
  starwars_species: unknown;
}
