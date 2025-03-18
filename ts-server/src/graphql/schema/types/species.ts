export const species = `
type Species {
  id: ID!
  name: String!
  classification: String!
  designation: String!
  averageHeight: String!
  skinColors: String!
  hairColors: String!
  eyeColors: String!
  averageLifespan: String!
  language: String!
  homeworld: Planet
  people: [Person!]!
}
`