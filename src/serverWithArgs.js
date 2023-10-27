import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { graphqlHTTP as express_graphql } from "express-graphql";
import { graphql } from "graphql";

const charactersData = [
  { id: 1, name: "Impa", age: 121, gender: "female" },
  { id: 2, name: "Daruk", age: 50, gender: "male" },
  { id: 3, name: "Revali", age: 21, gender: "male" },
  { id: 5, name: "Link", age: 17, gender: "male" },
  { id: 6, name: "Zelda", age: 17, gender: "female" },
];

var typeDefs = `#graphql
  type Character {
    name: String
    age: Int
    gender: String
  }
  type Query {
    characters(age: Int): [Character]
  }
`;

var resolvers = {
  Query: {
    characters(obj, args, context, info) {
      // args: The arguments provided to the field in the GraphQL query
      return args?.age
        ? charactersData.filter((character) => character.age === args.age)
        : charactersData;
    },
  },
};
const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const queryToExecute = `query { 
  characters (age: 17 ) { 
    name 
  } 
}`;
// Execute the GraphQL query
graphql({
  schema: executableSchema,
  source: queryToExecute,
}).then((response) => {
  console.log(JSON.stringify(response.data));
});

// Create an express server and a GraphQL endpoint
var app = express();
app.use(
  "/graphql",
  express_graphql({
    schema: executableSchema,
    graphiql: true,
  })
);

app.listen(4000, () =>
  console.log("Express GraphQL Server Now Running On localhost:4000/graphql")
);
