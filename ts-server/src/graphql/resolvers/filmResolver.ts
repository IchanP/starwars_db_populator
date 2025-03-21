import { GraphQLResolveInfo, SelectionNode } from "graphql";
import { Context } from "../../context";
import { findManyData, findManyIn } from ".";
import { planet } from "../schema/types/planet";

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

    const filmCharacters = (await findManyData(
      selections,
      "characters",
      context.prisma.starwars_film_characters,
      film?.id,
      "film_id"
    )) as { people_id: number }[];

    if (filmCharacters) {
      relatedData.starwars_film_characters = await findManyIn(
        context.prisma.starwars_people,
        filmCharacters,
        "people_id",
        "id"
      );
    }

    const filmPlanets = (await findManyData(
      selections,
      "planets",
      context.prisma.starwars_film_planets,
      film?.id,
      "film_id"
    )) as { planet_id: number }[];

    if (filmPlanets) {
      relatedData.starwars_film_planets = await findManyIn(
        context.prisma.starwars_planet,
        filmPlanets,
        "planet_id",
        "id"
      );
    }

    const filmStarships = await findManyData(
      selections,
      "starships",
      context.prisma.starwars_film_starships,
      film?.id,
      "film_id",
      "starwars_starship"
    );

    if (filmStarships) {
      relatedData.starwars_film_starships = await findManyIn(
        context.prisma.starwars_starship,
        filmStarships,
        "starship_id",
        "transport_ptr_id"
      );
    }

    const filmVehicles = await findManyData(
      selections,
      "vehicles",
      context.prisma.starwars_film_vehicles,
      film?.id,
      "film_id"
    );

    if (filmVehicles) {
      relatedData.starwars_film_vehicles = await findManyIn(
        context.prisma.starwars_vehicle,
        filmVehicles,
        "vehicle_id",
        "transport_ptr_id"
      );
    }

    const filmSpecies = await findManyData(
      selections,
      "species",
      context.prisma.starwars_film_species,
      film?.id,
      "film_id",
      "starwars_species"
    );

    if (filmSpecies) {
      relatedData.starwars_film_species = await findManyIn(
        context.prisma.starwars_species,
        filmSpecies,
        "species_id",
        "id"
      );
    }

    return {
      ...film,
      characters: relatedData.starwars_film_characters,
      planets: relatedData.starwars_film_planets,
      starships: relatedData.starwars_film_starships,
      vehicles: relatedData.starwars_film_vehicles,
      species: relatedData.starwars_film_species,
    };
  }
};
