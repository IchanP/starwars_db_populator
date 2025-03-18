export const query = `
  type Query {
    films: [Film]
    film(id: ID!): Film

    people: [Person]
    person(id: ID!): Person

    planets: [Planet]
    planet(id: ID!): Planet

    species: [Species]
    speciesById(id: ID!): Species

    starships: [Starship]
    starship(id: ID!): Starship

    transports: [Transport]
    transport(id: ID!): Transport

    vehicles: [Vehicle]
    vehicle(id: ID!): Vehicle
  }
  `;
