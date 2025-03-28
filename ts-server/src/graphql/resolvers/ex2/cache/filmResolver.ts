import { MercuriusContext } from "mercurius";
import { withContext } from "../../";
import { StarWarsFilm } from "../../Film";
import { getFromCache, setCache } from ".";

export const Film = {
  characters: (film: StarWarsFilm, _args: any, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const cacheKey = `filmCharacters:${film.id}`;
      let characters = await getFromCache(cacheKey, context.redis);

      if (!characters) {
        const peopleIds = film.starwars_film_characters.map(
          (character: { people_id: number }) => character.people_id
        );

        characters = await context.prisma.starwars_people.findMany({
          where: {
            id: { in: peopleIds },
          },
        });
        await setCache(cacheKey, characters, context.redis);
      }

      return characters;
    }),

  planets: (film: StarWarsFilm, _args: any, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const cacheKey = `filmPlanets:${film.id}`;
      let planets = await getFromCache(cacheKey, context.redis);

      if (!planets) {
        const planetIds = film.starwars_film_planets.map(
          (planet) => planet.planet_id
        );

        planets = await context.prisma.starwars_planet.findMany({
          where: {
            id: { in: planetIds },
          },
        });
        await setCache(cacheKey, planets, context.redis);
      }

      return planets;
    }),

  species: (film: StarWarsFilm, _args: any, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const cacheKey = `filmSpecies:${film.id}`;
      let species = await getFromCache(cacheKey, context.redis);

      if (!species) {
        const speciesIds = film.starwars_film_species.map(
          (species) => species.species_id
        );

        species = await context.prisma.starwars_species.findMany({
          where: { id: { in: speciesIds } },
        });
        await setCache(cacheKey, species, context.redis);
      }

      return species;
    }),

  starships: (film: StarWarsFilm, _args: any, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const cacheKey = `filmStarships:${film.id}`;
      let starships = await getFromCache(cacheKey, context.redis);

      if (!starships) {
        const starshipIds = film.starwars_film_starships.map(
          (starship) => starship.starship_id
        );

        starships = await context.prisma.starwars_starship.findMany({
          where: { transport_ptr_id: { in: starshipIds } },
        });
        await setCache(cacheKey, starships, context.redis);
      }

      return starships;
    }),

  vehicles: (film: StarWarsFilm, _args: any, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const cacheKey = `filmVehicles:${film.id}`;
      let vehicles = await getFromCache(cacheKey, context.redis);

      if (!vehicles) {
        const vehicleIds = film.starwars_film_vehicles.map(
          (vehicle) => vehicle.vehicle_id
        );

        vehicles = await context.prisma.starwars_vehicle.findMany({
          where: { transport_ptr_id: { in: vehicleIds } },
        });

        await setCache(cacheKey, vehicleIds, context.redis);
      }

      return vehicles;
    }),
};
