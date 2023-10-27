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

const queryToExecute = `query($age: Int) { 
  characters (age: $age ){ 
    name 
  } 
}`;

// Execute the GraphQL query
graphql({
  schema: executableSchema,
  source: queryToExecute,
  variableValues: { age: 17 },
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

//With an executableSchema, we don't need the rootValue anymore
