import { IResolvers } from "mercurius";
import { withContext } from ".";
import { GraphQLResolveInfo } from "graphql";
import { Person } from "./peopleResolver";
import { starshipResolver } from "./starshipResolver";
import { vehicleResolver } from "./vehicleResolver";
import { film } from "../schema/types/film";
import { planet } from "../schema/types/planet";
import { Film } from "./filmResolver";
import { Species } from "./speciesResolver";

export const resolvers: IResolvers = {
  Query: {
    films: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) =>
        context.prisma.starwars_film.findMany({
          include: {
            starwars_film_characters: true,
            starwars_film_planets: true,
            starwars_film_species: true,
            starwars_film_starships: true,
            starwars_film_vehicles: true,
          },
        })
      ),

    film: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) =>
        context.prisma.starwars_film.findUnique({
          where: { id: Number(args.id) },
          include: {
            starwars_film_characters: true,
            starwars_film_planets: true,
            starwars_film_species: true,
            starwars_film_starships: true,
            starwars_film_vehicles: true,
          },
        })
      ),

    // people: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
    //   withContext(cxt, async (context) => {
    //     const tempPeople = await context.prisma.starwars_people.findMany();
    //     const people = [];
    //     for (let i = 0; i < tempPeople.length; i++) {
    //       people[i] = await personResolver(info, context, tempPeople[i]);
    //     }
    //     return people;
    //   }),

    // person: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
    //   withContext(cxt, async (context) => {
    //     const person = await context.prisma.starwars_people.findUnique({
    //       where: { id: Number(args.id) },
    //     });

    //     return personResolver(info, context, person);
    //   }),

    planets: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) => context.prisma.starwars_planet.findMany()),

    planet: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) =>
        context.prisma.starwars_planet.findUnique({
          where: { id: Number(args.id) },
        })
      ),

    // species: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
    //   withContext(cxt, async (context) => {
    //     const tempSpecies = await context.prisma.starwars_species.findMany();
    //     const species = [];
    //     for (let i = 0; i < tempSpecies.length; i++) {
    //       species[i] = await speciesResolver(info, context, tempSpecies[i]);
    //     }
    //     return species;
    //   }),

    // speciesById: (
    //   _parent: any,
    //   args: any,
    //   cxt: any,
    //   info: GraphQLResolveInfo
    // ) =>
    //   withContext(cxt, async (context) => {
    //     const tempSpecie = await context.prisma.starwars_species.findUnique({
    //       where: { id: Number(args.id) },
    //     });
    //     return speciesResolver(info, context, tempSpecie);
    //   }),

    starships: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const tempStarships = await context.prisma.starwars_starship.findMany();
        const starships = [];
        for (let i = 0; i < tempStarships.length; i++) {
          starships[i] = await starshipResolver(
            info,
            context,
            tempStarships[i]
          );
        }
        return starships;
      }),

    starship: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        try {
          const tempStarship =
            await context.prisma.starwars_starship.findUnique({
              where: {
                transport_ptr_id: Number(args?.id),
              },
            });

          return !tempStarship
            ? null
            : starshipResolver(info, context, tempStarship);
        } catch (e: unknown) {
          return null;
        }
      }),

    transports: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, async (context) =>
        context.prisma.starwars_transport.findMany()
      ),

    transport: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) =>
        context.prisma.starwars_transport.findUnique({
          where: {
            id: Number(args.id),
          },
        })
      ),

    vehicles: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const tempVehicles = await context.prisma.starwars_vehicle.findMany();
        const vehicles = [];
        for (let i = 0; i < tempVehicles.length; i++) {
          vehicles[i] = await vehicleResolver(info, context, tempVehicles[i]);
        }
        return vehicles;
      }),

    vehicle: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const vehicle = await context.prisma.starwars_vehicle.findUnique({
          where: {
            transport_ptr_id: Number(args.id),
          },
        });
        return !vehicle ? null : vehicleResolver(info, context, vehicle);
      }),
  },

  Film: Film,

  Person: Person,

  Species: Species,
};
