import { GraphQLResolveInfo, SelectionNode } from "graphql";
import { findManyData, findManyIn, findUnique } from ".";
import { Context } from "../../context";
import { Person } from "./peopleResolver";

export type Starship = {
  transport_ptr_id: number;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots?: Person[];
} | null;

interface StarShipRelatedData {
  starwars_transport?: any;
  pilots?: any[];
}

export const starshipResolver = async (
  info: GraphQLResolveInfo,
  context: Context,
  starship: Starship
) => {
  const relatedData: StarShipRelatedData = {};

  if (info.fieldNodes) {
    const selections = info.fieldNodes[0].selectionSet
      ?.selections as SelectionNode[];

    relatedData.starwars_transport = await findUnique(
      selections,
      "starwars_transport",
      context.prisma.starwars_transport,
      starship?.transport_ptr_id,
      "id"
    );

    const pilotIds = await findManyData(
      selections,
      "pilots",
      context.prisma.starwars_starship_pilots,
      starship?.transport_ptr_id,
      "starship_id"
    );
    if (pilotIds) {
      relatedData.pilots = await findManyIn(
        context.prisma.starwars_people,
        pilotIds,
        "people_id",
        "id"
      );
    }
    return {
      ...starship,
      ...relatedData,
    };
  }
};
