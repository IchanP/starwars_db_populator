import { IResolvers, MercuriusContext } from "mercurius";
import { withContext } from ".";
import { Context } from "../../context";

export const resolvers: IResolvers = {
  Query: {
    films: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) => context.prisma.starwars_film.findMany()),

    film: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) =>
        context.prisma.starwars_film.findUnique({
          where: { id: Number(args.id) },
        })
      ),

    people: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) => context.prisma.starwars_people.findMany()),

    person: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) =>
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

    species: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) => context.prisma.starwars_species.findMany()),

    speciesById: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) =>
        context.prisma.starwars_species.findUnique({
          where: { id: Number(args.id) },
        })
      ),

    starships: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) =>
        context.prisma.starwars_starship.findMany({
          include: {
            starwars_transport: true,
          },
        })
      ),

    starship: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) =>
        context.prisma.starwars_starship.findUnique({
          where: {
            transport_ptr_id: Number(args.id),
          },
          include: {
            starwars_transport: true,
          },
        })
      ),

    transports: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) =>
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

    vehicles: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) =>
        context.prisma.starwars_vehicle.findMany({
          include: {
            starwars_transport: true,
          },
        })
      ),

    vehicle: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) =>
        context.prisma.starwars_vehicle.findUnique({
          where: {
            transport_ptr_id: Number(args.id),
          },
          include: {
            starwars_transport: true,
          },
        })
      ),
  },
};
