var Character = `#graphql
  type Character {
    name: String
    age: Int
    gender: String
    shortGender: String
    friends (age: Int): [Character]
  }`;

var Query = `#graphql
  type Query {
    characters(age: Int): [Character]
  }
`;

export default () => [Character, Query];
