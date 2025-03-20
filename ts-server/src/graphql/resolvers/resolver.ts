import { IResolvers, MercuriusContext } from "mercurius";
import { findManyData, withContext } from ".";
import { GraphQLResolveInfo, SelectionNode } from "graphql";

interface FilmRelatedData {
  starwars_film_characters?: any[];
  starwars_film_planets?: any[];
  starwars_film_starships?: any[];
  starwars_film_vehicles?: any[];
  starwars_film_species?: any[];
}

export const resolvers: IResolvers = {
  Query: {
    films: (_parent: any, args: any, cxt: any) =>
      withContext(cxt, (context) => {
        const films = context.prisma.starwars_film.findMany();
        // TODO do unbatched queries...
      }),

    film: (_parent: any, args: any, cxt: any, info: GraphQLResolveInfo) =>
      withContext(cxt, async (context) => {
        const film = await context.prisma.starwars_film.findUnique({
          where: { id: Number(args.id) },
        });

        // Initialize an object to hold the related data
        const relatedData: FilmRelatedData = {};

        if (info.fieldNodes) {
          const selections = info.fieldNodes[0].selectionSet
            ?.selections as SelectionNode[];

          relatedData.starwars_film_characters = await findManyData(
            selections,
            "characters",
            context.prisma.starwars_film_characters,
            film?.id,
            "film_id",
            "starwars_people"
          );

          relatedData.starwars_film_planets = await findManyData(
            selections,
            "planets",
            context.prisma.starwars_film_planets,
            film?.id,
            "film_id",
            "starwars_planet"
          );

          relatedData.starwars_film_starships = await findManyData(
            selections,
            "starships",
            context.prisma.starwars_film_starships,
            film?.id,
            "film_id",
            "starwars_starship"
          );

          relatedData.starwars_film_vehicles = await findManyData(
            selections,
            "vehicles",
            context.prisma.starwars_film_vehicles,
            film?.id,
            "film_id",
            "starwars_vehicle"
          );

          relatedData.starwars_film_species = await findManyData(
            selections,
            "species",
            context.prisma.starwars_film_species,
            film?.id,
            "film_id",
            "starwars_species"
          );

          const returnObject = {
            ...film,
            characters: relatedData.starwars_film_characters?.map(
              (fc) => fc.starwars_people
            ),
            planets: relatedData.starwars_film_planets?.map(
              (fp) => fp.starwars_planet
            ),
            starships: relatedData.starwars_film_starships?.map(
              (fs) => fs.starwars_starship
            ),
            vehicles: relatedData.starwars_film_vehicles?.map(
              (fv) => fv.starwars_vehicle
            ),
            species: relatedData.starwars_film_species?.map(
              (fsp) => fsp.starwars_species
            ),
          };
          // Transform the data to match the GraphQL schema
          return returnObject;
        }
      }),

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
