export const vehicle = `
type Vehicle {
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
  vehicleClass: String!
  pilots: [Person!]!
}
`