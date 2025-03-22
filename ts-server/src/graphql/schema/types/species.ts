export const species = `
type Species {
  id: ID!
  name: String!
  classification: String!
  designation: String!
  average_height: String!
  skin_colors: String!
  hair_colors: String!
  eye_colors: String!
  average_lifespan: String!
  language: String!
  homeworld: Planet
  people: [Person!]!
}
`;
