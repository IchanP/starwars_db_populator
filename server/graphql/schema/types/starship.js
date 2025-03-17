export const starship = `
type Starship {
  id: ID!
  name: String!
  model: String!
  manufacturer: String!
  costInCredits: String!
  length: String!
  maxAtmospheringSpeed: String!
  crew: String!
  passengers: String!
  cargoCapacity: String!
  consumables: String!
  hyperdriveRating: String!
  MGLT: String!
  starshipClass: String!
  pilots: [Person!]!
}
`