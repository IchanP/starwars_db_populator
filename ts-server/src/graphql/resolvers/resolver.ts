import { IResolvers } from "mercurius";
import { withContext } from ".";
import { GraphQLResolveInfo } from "graphql";
import { Person } from "./peopleResolver";
import { Starship } from "./starshipResolver";
import { vehicleResolver } from "./vehicleResolver";
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

    people: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) =>
        context.prisma.starwars_people.findMany()
      ),

    person: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) =>
        context.prisma.starwars_people.findUnique({
          where: { id: Number(args.id) },
        })
      ),

    planets: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) => context.prisma.starwars_planet.findMany()),

    planet: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) =>
        context.prisma.starwars_planet.findUnique({
          where: { id: Number(args.id) },
        })
      ),

    species: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) =>
        context.prisma.starwars_species.findMany()
      ),

    speciesById: (
      _parent: any,
      args: any,
      cxt: any,
      info: GraphQLResolveInfo
    ) =>
      withContext(cxt, async (context) =>
        context.prisma.starwars_species.findUnique({
          where: { id: Number(args.id) },
        })
      ),

    starships: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) =>
        withContext(cxt, async (context) =>
          context.prisma.starwars_starship.findMany()
        )
      ),

    starship: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) =>
        context.prisma.starwars_starship.findUnique({
          where: { transport_ptr_id: Number(args.id) },
        })
      ),

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

  Starship: Starship,
};
