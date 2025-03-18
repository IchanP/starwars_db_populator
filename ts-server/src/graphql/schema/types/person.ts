export const person = `
type Person {
  id: ID!
  name: String!
  birthYear: String!
  gender: String!
  height: String
  mass: String
  hairColor: String
  skinColor: String
  eyeColor: String
  homeworld: Planet
  species: [Species!]!
}
`