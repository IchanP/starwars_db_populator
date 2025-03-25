import { MercuriusContext } from "mercurius";
import { withContext } from ".";
import { StarshipInterface } from "./Starship";

export const Starship = {
  pilots: (
    starship: StarshipInterface,
    _args: unknown,
    cxt: MercuriusContext
  ) =>
    withContext(cxt, async (context) => {
      const starshipPilots =
        await context.prisma.starwars_starship_pilots.findMany({
          where: { starship_id: starship.transport_ptr_id },
          include: {
            starwars_people: true,
          },
        });
      return starshipPilots.map((people) => people.starwars_people);
    }),

  starwars_transport: (
    starship: StarshipInterface,
    _args: unknown,
    cxt: MercuriusContext
  ) =>
    withContext(cxt, async (context) =>
      context.prisma.starwars_transport.findUnique({
        where: { id: starship.transport_ptr_id },
      })
    ),
};
