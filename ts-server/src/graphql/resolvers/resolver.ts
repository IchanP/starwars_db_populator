import { IResolvers, MercuriusContext } from "mercurius";
import { Context } from "../../context";

export const resolvers = {
  Query: {
    films: async (_parent: any, args: any, cxt: any) => {
      const content = cxt as Context;
      // TODO prisma is undefined...
      console.log(content.prisma);
      return await content.prisma.starwars_film.findMany();
    },
  },
};
