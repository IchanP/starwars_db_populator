import { query } from './query.js';
import { film } from './types/film.js';
import { person } from './types/person.js';
import { planet } from './types/planet.js';
import { species } from './types/species.js';
import { starship } from './types/starship.js';
import { transport } from './types/transport.js';
import { vehicle } from './types/vehicle.js';
import { mergeTypeDefs } from '@graphql-tools/merge';

export const typeDefs = mergeTypeDefs([
  query,
  film,
  person,
  planet,
  species,
  starship,
  transport,
  vehicle
]);
