export const film = `
type Film {
    id: ID!
    title: String!
    episodeId: Int!
    openingCrawl: String!
    director: String!
    producer: String!
    releaseDate: String!
    characters: [Person!]!
    planets: [Planet!]!
    starships: [Starship!]!
    vehicles: [Vehicle!]!
    species: [Species!]!
  }
`