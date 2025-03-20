import { GraphQLResolveInfo, SelectionNode } from "graphql";
import { Context } from "../../context";
import { isFieldNode } from ".";

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

// TODO clean this up
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

    if (
      selections.some(
        (selection) =>
          isFieldNode(selection) && selection.name.value === "species"
      )
    ) {
      const speciesPeople =
        await context.prisma.starwars_species_people.findMany({
          where: { people_id: person?.id },
        });

      if (speciesPeople) {
        const speciesIds = speciesPeople.map((sp) => sp.species_id);
        relatedData.species = [
          ...(await context.prisma.starwars_species.findMany({
            where: { id: { in: speciesIds } },
          })),
        ];
      }
    }

    if (
      selections.some(
        (selection) =>
          isFieldNode(selection) && selection.name.value === "homeworld"
      )
    ) {
      relatedData.homeworld = await context.prisma.starwars_planet.findUnique({
        where: { id: person?.homeworld_id },
      });
    }
    return {
      ...person,
      ...relatedData,
    };
  }
};
