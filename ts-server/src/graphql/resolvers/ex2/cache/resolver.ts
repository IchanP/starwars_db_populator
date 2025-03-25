import { IResolvers } from "mercurius";
import { GraphQLResolveInfo } from "graphql";
import { filmResolver } from "../../filmResolver";
import { personResolver } from "../../peopleResolver";
import { speciesResolver } from "../../speciesResolver";
import { starshipResolver } from "../../starshipResolver";
import { vehicleResolver } from "../../vehicleResolver";
import { withContext } from "../../";

// Helper function to cache and retrieve from Redis
const getFromCache = async (key: string, redis: any): Promise<any> => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const setCache = async (key: string, data: any, redis: any) => {
  redis.setEx(key, 300, JSON.stringify(data)); // 5 minutes
};

export const resolvers: IResolvers = {
  Query: {
    films: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const cacheKey = `films`;
        let films = await getFromCache(cacheKey, context.redis);
        if (!films) {
          const tempFilms = await context.prisma.starwars_film.findMany();
          films = [];
          for (let i = 0; i < tempFilms.length; i++) {
            films[i] = await filmResolver(info, context, tempFilms[i]);
          }
          await setCache(cacheKey, films, context.redis);
        }
        return films;
      }),

    film: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const filmId = args.id;
        const cacheKey = `film:${filmId}`;
        let film = await getFromCache(cacheKey, context.redis);
        if (!film) {
          const filmData = await context.prisma.starwars_film.findUnique({
            where: { id: Number(filmId) },
          });
          film = await filmResolver(info, context, filmData);
          await setCache(cacheKey, film, context.redis);
        }
        return film;
      }),

    person: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const personId = args.id;
        const cacheKey = `person:${personId}`;
        let person = await getFromCache(cacheKey, context.redis);
        if (!person) {
          const personData = await context.prisma.starwars_people.findUnique({
            where: { id: Number(personId) },
          });
          person = await personResolver(info, context, personData);
          await setCache(cacheKey, person, context.redis);
        }
        return person;
      }),

    species: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const cacheKey = `species`;
        let species = await getFromCache(cacheKey, context.redis);
        if (!species) {
          const tempSpecies = await context.prisma.starwars_species.findMany();
          species = [];
          for (let i = 0; i < tempSpecies.length; i++) {
            species[i] = await speciesResolver(info, context, tempSpecies[i]);
          }
          await setCache(cacheKey, species, context.redis);
        }
        return species;
      }),

    speciesById: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const speciesId = args.id;
        const cacheKey = `species:${speciesId}`;
        let species = await getFromCache(cacheKey, context.redis);
        if (!species) {
          const speciesData = await context.prisma.starwars_species.findUnique({
            where: { id: Number(speciesId) },
          });
          species = await speciesResolver(info, context, speciesData);
          await setCache(cacheKey, species, context.redis);
        }
        return species;
      }),

    starship: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const starshipId = args.id;
        const cacheKey = `starship:${starshipId}`;
        let starship = await getFromCache(cacheKey, context.redis);
        if (!starship) {
          const starshipData = await context.prisma.starwars_starship.findUnique({
            where: { transport_ptr_id: Number(starshipId) },
          });
          starship = await starshipResolver(info, context, starshipData);
          await setCache(cacheKey, starship, context.redis);
        }
        return starship;
      }),

    vehicle: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const vehicleId = args.id;
        const cacheKey = `vehicle:${vehicleId}`;
        let vehicle = await getFromCache(cacheKey, context.redis);
        if (!vehicle) {
          const vehicleData = await context.prisma.starwars_vehicle.findUnique({
            where: { transport_ptr_id: Number(vehicleId) },
          });
          vehicle = await vehicleResolver(info, context, vehicleData);
          await setCache(cacheKey, vehicle, context.redis);
        }
        return vehicle;
      }),
  },
};
