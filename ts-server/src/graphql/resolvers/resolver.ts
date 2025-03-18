import { IResolvers, MercuriusContext } from "mercurius";
import { Context } from "../../context";
import { convertToContextType } from ".";

export const resolvers = {
  Query: {
    films: async (_parent: any, args: any, cxt: any) => {
      const context = convertToContextType(cxt);
      return await context.prisma.starwars_film.findMany();
    },
    film: async (_parent: any, args: any, cxt: any) => {
      const context = convertToContextType(cxt);
      return await context.prisma.starwars_film.findUnique({
        where: { id: Number(args.id) },
      });
    },
  },
};
