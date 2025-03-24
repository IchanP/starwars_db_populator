import { GraphQLResolveInfo, SelectionNode } from "graphql";
import { Context } from "../../context";
import { findManyData, findManyIn, findUnique } from ".";
import { SpeciesPeople } from "./peopleResolver";

type Species = {
  id: number;
  created: Date;
  edited: Date;
  name: string;
  homeworld_id: number | null;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  language: string;
} | null;

interface SpeciesRelatedData {
  people?: any[];
  homeworld?: any;
}

// TODO - this is very similar to peopleResolver...
export const speciesResolver = async (
  info: GraphQLResolveInfo,
  context: Context,
  species: Species
) => {
  const relatedData: SpeciesRelatedData = {};

  if (info.fieldNodes) {
    const selections = info.fieldNodes[0].selectionSet
      ?.selections as SelectionNode[];

    const speciesPeople = (await findManyData(
      selections,
      "people",
      context.prisma.starwars_species_people,
      species?.id,
      "species_id"
    )) as SpeciesPeople[];

    if (speciesPeople) {
      relatedData.people = await findManyIn(
        context.prisma.starwars_people,
        speciesPeople,
        "people_id",
        "id"
      );
    }

    if (species?.homeworld_id) {
      relatedData.homeworld = await findUnique(
        selections,
        "homeworld",
        context.prisma.starwars_planet,
        species?.homeworld_id,
        "id"
      );
    }

    return {
      ...species,
      ...relatedData,
    };
  }
};
