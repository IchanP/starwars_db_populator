interface StarWarsFilmCharacter {
  id: bigint;
  film_id: number;
  people_id: number;
}

interface StarWarsFilmPlanet {
  id: bigint;
  film_id: number;
  planet_id: number;
}

interface StarWarsFilmSpecies {
  id: bigint;
  film_id: number;
  species_id: number;
}

interface StarWarsFilmStarship {
  id: bigint;
  film_id: number;
  starship_id: number;
}

interface StarWarsFilmVehicle {
  id: bigint;
  film_id: number;
  vehicle_id: number;
}

export interface StarWarsFilm {
  id: number;
  created: string;
  edited: string;
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  starwars_film_characters: StarWarsFilmCharacter[];
  starwars_film_planets: StarWarsFilmPlanet[];
  starwars_film_species: StarWarsFilmSpecies[];
  starwars_film_starships: StarWarsFilmStarship[];
  starwars_film_vehicles: StarWarsFilmVehicle[];
}
