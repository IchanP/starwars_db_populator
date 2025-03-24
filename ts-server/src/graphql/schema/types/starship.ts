export const starship = `
type Starship {
  transport_ptr_id: ID!
  hyperdrive_rating: String!
  MGLT: String!
  starship_class: String!
  starwars_transport: Transport!
  pilots: [Person!]!
}
`;
