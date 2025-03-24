import { GraphQLResolveInfo, SelectionNode } from "graphql";
import { findManyData, findManyIn, findUnique } from ".";
import { Context } from "../../context";

type Vehicle = {
  transport_ptr_id: number;
  vehicle_class: string;
} | null;

interface VehicleRelatedData {
  starwars_transport?: any;
}

export const vehicleResolver = async (
  info: GraphQLResolveInfo,
  context: Context,
  vehicle: Vehicle
) => {
  const relatedData: VehicleRelatedData = {};

  if (info.fieldNodes) {
    const selections = info.fieldNodes[0].selectionSet
      ?.selections as SelectionNode[];

    relatedData.starwars_transport = await findUnique(
      selections,
      "starwars_transport",
      context.prisma.starwars_transport,
      vehicle?.transport_ptr_id,
      "id"
    );

    return {
      ...vehicle,
      ...relatedData,
    };
  }
};
