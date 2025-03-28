import { IResolvers } from "mercurius";
import { withContext } from "../../";
import { Film } from "./filmResolver";
import { Person } from "./peopleResolver";
import { Species } from "./speciesResolver";
import { Starship } from "./starshipResolver";
import { Vehicle } from "./vehicleResolver";
import { getFromCache, setCache } from ".";

export const resolvers: IResolvers = {
  Query: {
    films: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const cacheKey = `films`;
        let films = await getFromCache(cacheKey, context.redis);
        if (!films) {
          // TODO doesn't work with bigInt...
          films = await context.prisma.starwars_film.findMany({
            include: {
              starwars_film_characters: true,
              starwars_film_planets: true,
              starwars_film_species: true,
              starwars_film_starships: true,
              starwars_film_vehicles: true,
            },
          });
          await setCache(cacheKey, films, context.redis);
        }
        return films;
      }),

    film: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const filmId = args.id;
        const cacheKey = `film:${filmId}`;
        let film = await getFromCache(cacheKey, context.redis);
        if (!film) {
          context.prisma.starwars_people.findMany();
          film = await context.prisma.starwars_film.findUnique({
            where: { id: Number(args.id) },
            include: {
              starwars_film_characters: true,
              starwars_film_planets: true,
              starwars_film_species: true,
              starwars_film_starships: true,
              starwars_film_vehicles: true,
            },
          });
          await setCache(cacheKey, film, context.redis);
        }
        return film;
      }),

    people: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const cacheKey = "people";
        let people = await getFromCache(cacheKey, context.redis);
        if (!people) {
          people = await context.prisma.starwars_people.findMany();
          await setCache(cacheKey, people, context.redis);
        }
        return people;
      }),

    person: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const personId = args.id;
        const cacheKey = `person:${personId}`;
        let person = await getFromCache(cacheKey, context.redis);
        if (!person) {
          person = await context.prisma.starwars_people.findUnique({
            where: { id: Number(args.id) },
          });
          await setCache(cacheKey, person, context.redis);
        }
        return person;
      }),

    planets: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const cacheKey = `planets`;
        let planets = await getFromCache(cacheKey, context.redis);
        if (!planets) {
          planets = await context.prisma.starwars_planet.findMany();
          console.log(planets);
          await setCache(cacheKey, planets, context.redis);
        }
        return planets;
      }),

    planet: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const planetId = args.id;
        const cacheKey = `planet:${planetId}`;
        let planet = await getFromCache(cacheKey, context.redis);
        if (!planet) {
          planet = await context.prisma.starwars_planet.findUnique({
            where: { id: Number(args.id) },
          });
          await setCache(cacheKey, planet, context.redis);
        }
        return planet;
      }),

    species: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const cacheKey = `species`;
        let species = await getFromCache(cacheKey, context.redis);
        if (!species) {
          species = await context.prisma.starwars_species.findMany();
          await setCache(cacheKey, species, context.redis);
        }
        return species;
      }),

    speciesById: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const speciesId = args.id;
        const cacheKey = `species:${speciesId}`;
        let species = await getFromCache(cacheKey, context.redis);
        if (!species) {
          species = await context.prisma.starwars_species.findUnique({
            where: { id: Number(args.id) },
          });
          await setCache(cacheKey, species, context.redis);
        }
        return species;
      }),

    starships: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const cacheKey = "starships";
        let starships = await getFromCache(cacheKey, context.redis);
        if (!starships) {
          starships = await context.prisma.starwars_starship.findMany();
          await setCache(cacheKey, starships, context.redis);
        }
        return starships;
      }),

    starship: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const starshipId = args.id;
        const cacheKey = `starship:${starshipId}`;
        let starship = await getFromCache(cacheKey, context.redis);
        if (!starship) {
          starship = await context.prisma.starwars_starship.findUnique({
            where: { transport_ptr_id: Number(args.id) },
          });
          await setCache(cacheKey, starship, context.redis);
        }
        return starship;
      }),

    transports: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const cachekey = `transports`;
        let transports = await getFromCache(cachekey, context.redis);
        if (!transports) {
          transports = await context.prisma.starwars_transport.findMany();
          await setCache(cachekey, transports, context.redis);
        }
        return transports;
      }),

    transport: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const transportId = args.id;
        const cacheKey = `transport:${transportId}`;
        let transport = await getFromCache(cacheKey, context.redis);
        if (!transport) {
          transport = await context.prisma.starwars_transport.findUnique({
            where: {
              id: Number(args.id),
            },
          });
          await setCache(cacheKey, transport, context.redis);
        }
        return transport;
      }),

    vehicles: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const cacheKey = "vehicles";
        let vehicles = await getFromCache(cacheKey, context.redis);
        if (!vehicles) {
          vehicles = await context.prisma.starwars_vehicle.findMany();
          await setCache(cacheKey, vehicles, context.redis);
        }
        return vehicles;
      }),

    vehicle: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) => {
        const vehicleId = args.id;
        const cacheKey = `vehicle:${vehicleId}`;
        let vehicle = await getFromCache(cacheKey, context.redis);
        if (!vehicle) {
          vehicle = await context.prisma.starwars_vehicle.findUnique({
            where: { transport_ptr_id: Number(args.id) },
          });
          await setCache(cacheKey, vehicle, context.redis);
        }
        return vehicle;
      }),
  },

  Film: Film,

  Person: Person,

  Species: Species,

  Starship: Starship,

  Vehicle: Vehicle,
};
