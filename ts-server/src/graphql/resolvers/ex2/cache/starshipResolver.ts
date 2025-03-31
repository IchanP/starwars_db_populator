import { MercuriusContext } from "mercurius";
import { withContext } from "../../";
import { StarshipInterface } from "../../Starship";
import { getFromCache, setCache } from ".";

export const Starship = {
  pilots: (
    starship: StarshipInterface,
    _args: unknown,
    cxt: MercuriusContext
  ) =>
    withContext(cxt, async (context) => {
      const cacheKey = `starshipPilots:${starship.transport_ptr_id}`;
      let pilots = await getFromCache(cacheKey, context.redis);

      if (!pilots) {
        const starshipPilots =
          await context.prisma.starwars_starship_pilots.findMany({
            where: { starship_id: starship.transport_ptr_id },
            include: {
              starwars_people: true,
            },
          });

        pilots = starshipPilots.map(
          (people: StarshipPilot) => people.starwars_people
        );

        await setCache(cacheKey, pilots, context.redis);
      }

      return pilots;
    }),

  starwars_transport: (
    starship: StarshipInterface,
    _args: unknown,
    cxt: MercuriusContext
  ) =>
    withContext(cxt, async (context) => {
      const cacheKey = `starshipTransport:${starship.transport_ptr_id}`;
      let transport = await getFromCache(cacheKey, context.redis);

      if (!transport) {
        transport = await context.prisma.starwars_transport.findUnique({
          where: { id: starship.transport_ptr_id },
        });

        await setCache(cacheKey, transport, context.redis);
      }

      return transport;
    }),
};

interface StarshipPilot {
  starwars_people: unknown;
}
