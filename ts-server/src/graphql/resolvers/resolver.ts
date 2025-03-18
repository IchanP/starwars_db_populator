import { IResolvers, MercuriusContext } from "mercurius";
import { Context } from "../../context";

export const resolvers = {
  Query: {
    films: async (_parent: any, args: any, cxt: any) => {
      // TODO make boiler plate it's own function
      const content = cxt as Context;
      return await content.prisma.starwars_film.findMany();
    },
    film: async (_parent: any, args: any, cxt: any) => {
      const context = cxt as Context;
      console.log(args);
      return await context.prisma.starwars_film.findUnique({
        where: { id: Number(args.id) },
      });
    },
  },
};
