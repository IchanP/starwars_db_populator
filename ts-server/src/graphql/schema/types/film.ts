export const film = `
type Film {
    id: ID!
    title: String!
    episode_id: Int!
    opening_crawl: String!
    director: String!
    producer: String!
    release_date: String!
    characters: [Person!]!
    planets: [Planet!]!
    starships: [Starship!]!
    vehicles: [Vehicle!]!
    species: [Species!]!
  }
`;
