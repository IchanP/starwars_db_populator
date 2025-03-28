import { MercuriusContext } from "mercurius";
import { Specie } from "../../Species";
import { withContext } from "../../";
import { getFromCache, setCache } from ".";

export const Species = {
  homeworld: (species: Specie, _args: unknown, cxt: MercuriusContext) => {
    if (!species.homeworld_id) return;

    return withContext(cxt, async (context) => {
      const cacheKey = `speciesHomeworld:${species.id}`;
      let homeworld = await getFromCache(cacheKey, context.redis);

      if (!homeworld) {
        homeworld = await context.prisma.starwars_planet.findUnique({
          where: { id: Number(species.homeworld_id) },
        });

        await setCache(cacheKey, homeworld, context.redis);
      }

      return homeworld;
    });
  },

  people: (species: Specie, _args: unknown, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const cacheKey = `speciesPeople:${species.id}`;
      let people = await getFromCache(cacheKey, context.redis);

      if (!people) {
        const speciesPeople =
          await context.prisma.starwars_species_people.findMany({
            where: { species_id: species.id },
            include: {
              starwars_people: true,
            },
          });

        people = speciesPeople.map(
          (people: SpeciesPerson) => people.starwars_people
        );

        await setCache(cacheKey, people, context.redis);
      }

      return people;
    }),
};

interface SpeciesPerson {
  starwars_people: unknown;
}
