import { MercuriusContext } from "mercurius";
import { IVehicle } from "../../Vehicle";
import { withContext } from "../../";
import { getFromCache, setCache } from ".";

export const Vehicle = {
  starwars_transport: (
    vehicle: IVehicle,
    _args: unknown,
    cxt: MercuriusContext
  ) =>
    withContext(cxt, async (context) => {
      const cacheKey = `vehicleTransport:${vehicle.transport_ptr_id}`;
      let transport = await getFromCache(cacheKey, context.redis);

      if (!transport) {
        transport = await context.prisma.starwars_transport.findUnique({
          where: { id: vehicle.transport_ptr_id },
        });

        await setCache(cacheKey, transport, context.redis);
      }

      return transport;
    }),
};
