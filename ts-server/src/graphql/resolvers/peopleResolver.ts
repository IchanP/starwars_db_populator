import { MercuriusContext } from "mercurius";
import { withContext } from ".";
import { Character } from "./Person";

export const Person = {
  homeworld: (person: Character, _args: unknown, cxt: MercuriusContext) =>
    withContext(cxt, async (context) =>
      context.prisma.starwars_planet.findUnique({
        where: { id: person.homeworld_id },
      })
    ),
};
