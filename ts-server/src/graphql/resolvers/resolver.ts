import { Context } from "../../context";

export const resolvers = {
  Query: {
    films: async (_, args, context: Context) => {
      return await context.prisma.starwars_film.findMany();
    },
  },
};
