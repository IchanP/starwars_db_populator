import { MercuriusContext } from "mercurius";
import { IVehicle } from "./Vehicle";
import { withContext } from ".";

export const Vehicle = {
  starwars_transport: (
    vehicle: IVehicle,
    _args: unknown,
    cxt: MercuriusContext
  ) =>
    withContext(cxt, async (context) =>
      context.prisma.starwars_transport.findUnique({
        where: { id: vehicle.transport_ptr_id },
      })
    ),
};
