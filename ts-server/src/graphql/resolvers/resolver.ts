import { IResolvers, MercuriusContext } from "mercurius";
import { findManyData, withContext } from ".";
import { GraphQLResolveInfo, SelectionNode } from "graphql";
import { filmResolver } from "./filmResolver";
import { personResolver } from "./peopleResolver";
import { speciesResolver } from "./speciesResolver";
import { starshipResolver } from "./starshipResolver";
import { vehicleResolver } from "./vehicleResolver";

export const resolvers: IResolvers = {
  Query: {
    films: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const tempFilms = await context.prisma.starwars_film.findMany();
        const films = [];
        for (let i = 0; i < tempFilms.length; i++) {
          films[i] = await filmResolver(info, context, tempFilms[i]);
        }
        return films;
      }),

    film: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const film = await context.prisma.starwars_film.findUnique({
          where: { id: Number(args.id) },
        });

        return filmResolver(info, context, film);
      }),

    people: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const tempPeople = await context.prisma.starwars_people.findMany();
        const people = [];
        for (let i = 0; i < tempPeople.length; i++) {
          people[i] = await personResolver(info, context, tempPeople[i]);
        }
        return people;
      }),

    person: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const person = await context.prisma.starwars_people.findUnique({
          where: { id: Number(args.id) },
        });

        return personResolver(info, context, person);
      }),

    planets: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) => context.prisma.starwars_planet.findMany()),

    planet: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) =>
        context.prisma.starwars_planet.findUnique({
          where: { id: Number(args.id) },
        })
      ),

    species: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const tempSpecies = await context.prisma.starwars_species.findMany();
        const species = [];
        for (let i = 0; i < tempSpecies.length; i++) {
          species[i] = await speciesResolver(info, context, tempSpecies[i]);
        }
        return species;
      }),

    speciesById: (
      _parent: any,
      args: any,
      cxt: any,
      info: GraphQLResolveInfo
    ) =>
      withContext(cxt, async (context) => {
        const tempSpecie = await context.prisma.starwars_species.findUnique({
          where: { id: Number(args.id) },
        });
        return speciesResolver(info, context, tempSpecie);
      }),

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
};
