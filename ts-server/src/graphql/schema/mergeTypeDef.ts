import { query } from "./query";
import { film } from "./types/film";
import { person } from "./types/person";
import { planet } from "./types/planet";
import { species } from "./types/species";
import { starship } from "./types/starship";
import { transport } from "./types/transport";
import { vehicle } from "./types/vehicle";
import { mergeTypeDefs } from "@graphql-tools/merge";

export const typeDefs = mergeTypeDefs([
  query,
  film,
  person,
  planet,
  species,
  starship,
  transport,
  vehicle,
]);
