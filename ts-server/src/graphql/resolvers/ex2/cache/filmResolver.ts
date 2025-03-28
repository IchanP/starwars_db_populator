import { MercuriusContext } from "mercurius";
import { withContext } from "../../";
import { StarWarsFilm } from "../../Film";

export const Film = {
  characters: (film: StarWarsFilm, _args: any, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const peopleIds = film.starwars_film_characters.map(
        (character: { people_id: number }) => character.people_id
      );
      return context.prisma.starwars_people.findMany({
        where: {
          id: { in: peopleIds },
        },
      });
    }),

  planets: (film: StarWarsFilm, _args: any, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const planetIds = film.starwars_film_planets.map(
        (planet) => planet.planet_id
      );
      return context.prisma.starwars_planet.findMany({
        where: {
          id: { in: planetIds },
        },
      });
    }),

  species: (film: StarWarsFilm, _args: any, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const speciesIds = film.starwars_film_species.map(
        (species) => species.species_id
      );
      return context.prisma.starwars_species.findMany({
        where: { id: { in: speciesIds } },
      });
    }),

  starships: (film: StarWarsFilm, _args: any, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const starshipIds = film.starwars_film_starships.map(
        (starship) => starship.starship_id
      );
      return context.prisma.starwars_starship.findMany({
        where: { transport_ptr_id: { in: starshipIds } },
      });
    }),

  vehicles: (film: StarWarsFilm, _args: any, cxt: MercuriusContext) =>
    withContext(cxt, async (context) => {
      const vehicleIds = film.starwars_film_vehicles.map(
        (vehicle) => vehicle.vehicle_id
      );
      return context.prisma.starwars_vehicle.findMany({
        where: { transport_ptr_id: { in: vehicleIds } },
      });
    }),
};
