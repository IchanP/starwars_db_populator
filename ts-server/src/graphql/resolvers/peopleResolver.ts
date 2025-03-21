import { GraphQLResolveInfo, SelectionNode } from "graphql";
import { Context } from "../../context";
import { findManyData, findManyIn, findUnique, isFieldNode } from ".";

type Person = {
  id: number;
  name: string;
  created: Date;
  edited: Date;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld_id: number;
} | null;

interface PersonRelatedData {
  species?: any[];
  homeworld?: any;
}

export interface SpeciesPeople {
  id: bigint;
  species_id: number;
  people_id: number;
}

export const personResolver = async (
  info: GraphQLResolveInfo,
  context: Context,
  person: Person
) => {
  const relatedData: PersonRelatedData = {};

  // Make sure that field nodes exist for intellisense.
  if (info.fieldNodes) {
    const selections = info.fieldNodes[0].selectionSet
      ?.selections as SelectionNode[];

    const speciesPeople = (await findManyData(
      selections,
      "species",
      context.prisma.starwars_species_people,
      person?.id,
      "people_id"
    )) as SpeciesPeople[];

    // Don't really like having this here but whatever for now
    if (speciesPeople) {
      relatedData.species = await findManyIn(
        context.prisma.starwars_species,
        speciesPeople,
        "species_id",
        "id"
      );
    }

    relatedData.homeworld = await findUnique(
      selections,
      "homeworld",
      context.prisma.starwars_planet,
      person?.homeworld_id,
      "id"
    );

    return {
      ...person,
      ...relatedData,
    };
  }
};
