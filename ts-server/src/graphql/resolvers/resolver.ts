import { IResolvers, MercuriusContext } from "mercurius";
import { Context } from "../../context";

export const resolvers = {
  Query: {
    films: async (_parent: any, args: any, cxt: any) => {
      const content = cxt as Context;
      // TODO prisma is undefined...
      console.log(content.prisma);
      const films = await content.prisma.starwars_film.findMany();
      console.log(films);
      return films.map((film) => ({
        ...film,
        id: film.id.toString(), // Convert BigInt to string
      }));
    },
  },
};
