import { MercuriusContext } from "mercurius";
import { withContext } from "../../";
import { Character } from "../../Person";
import { getFromCache, setCache } from ".";

export const Person = {
  homeworld: (person: Character, _args: unknown, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const cacheKey = `personHomeworld:${person.id}`;
      let homeworld = await getFromCache(cacheKey, context.redis);

      if (!homeworld) {
        homeworld = await context.prisma.starwars_planet.findUnique({
          where: { id: person.homeworld_id },
        });

        await setCache(cacheKey, homeworld, context.redis);
      }

      return homeworld;
    }),

  species: (person: Character, _args: unknown, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const cacheKey = `personSpecies:${person.id}`;
      let species = await getFromCache(cacheKey, context.redis);

      if (!species) {
        const speciesPeople =
          await context.prisma.starwars_species_people.findMany({
            where: { people_id: person.id },
            include: {
              starwars_species: true,
            },
          });

        species = speciesPeople.map(
          (species: SpeciesPerson) => species.starwars_species
        );

        await setCache(cacheKey, species, context.redis);
      }

      return species;
    }),
};

interface SpeciesPerson {
  starwars_species: unknown;
}
