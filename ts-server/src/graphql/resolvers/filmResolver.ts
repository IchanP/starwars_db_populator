import { GraphQLResolveInfo, SelectionNode } from "graphql";
import { Context } from "../../context";
import { findManyData } from ".";

type Film = {
  id: number;
  created: Date;
  edited: Date;
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: Date;
} | null;

interface FilmRelatedData {
  starwars_film_characters?: any[];
  starwars_film_planets?: any[];
  starwars_film_starships?: any[];
  starwars_film_vehicles?: any[];
  starwars_film_species?: any[];
}

export const filmResolver = async (
  info: GraphQLResolveInfo,
  context: Context,
  film: Film
) => {
  const relatedData: FilmRelatedData = {};

  // Make sure that field nodes exist for intellisense.
  if (info.fieldNodes) {
    const selections = info.fieldNodes[0].selectionSet
      ?.selections as SelectionNode[];

    relatedData.starwars_film_characters = await findManyData(
      selections,
      "characters",
      context.prisma.starwars_film_characters,
      film?.id,
      "film_id",
      "starwars_people"
    );

    relatedData.starwars_film_planets = await findManyData(
      selections,
      "planets",
      context.prisma.starwars_film_planets,
      film?.id,
      "film_id",
      "starwars_planet"
    );

    relatedData.starwars_film_starships = await findManyData(
      selections,
      "starships",
      context.prisma.starwars_film_starships,
      film?.id,
      "film_id",
      "starwars_starship"
    );

    relatedData.starwars_film_vehicles = await findManyData(
      selections,
      "vehicles",
      context.prisma.starwars_film_vehicles,
      film?.id,
      "film_id",
      "starwars_vehicle"
    );

    relatedData.starwars_film_species = await findManyData(
      selections,
      "species",
      context.prisma.starwars_film_species,
      film?.id,
      "film_id",
      "starwars_species"
    );

    return {
      ...film,
      characters: relatedData.starwars_film_characters?.map(
        (fc) => fc.starwars_people
      ),
      planets: relatedData.starwars_film_planets?.map(
        (fp) => fp.starwars_planet
      ),
      starships: relatedData.starwars_film_starships?.map(
        (fs) => fs.starwars_starship
      ),
      vehicles: relatedData.starwars_film_vehicles?.map(
        (fv) => fv.starwars_vehicle
      ),
      species: relatedData.starwars_film_species?.map(
        (fsp) => fsp.starwars_species
      ),
    };
  }
};
