import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { graphqlHTTP as express_graphql } from "express-graphql";
import { graphql } from "graphql";

var typeDefs = `
    type Query {
        message: String
    }
`;

var resolvers = {
  Query: {
    message() {
      return "Hello World!";
    },
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const queryToExecute = "{ message }";
// Execute the GraphQL query
graphql({ schema: executableSchema, source: queryToExecute }).then(
  (response) => {
    console.log(JSON.stringify(response.data));
  }
);

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
