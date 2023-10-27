import express from "express";
import { graphqlHTTP as express_graphql } from "express-graphql";
import { buildSchema, graphql } from "graphql";

const typeDefs = `#graphql
  type Query {
    message: String
  }
`;

// GraphQL schema
var schema = buildSchema(typeDefs);

// Root resolver
var root = {
  message: () => "Hello World!",
};

const queryToExecute = "{ message }";
// Execute the GraphQL query
graphql({ schema, rootValue: root, source: queryToExecute }).then(
  (response) => {
    console.log(JSON.stringify(response.data));
  }
);

// Create an express server and a GraphQL endpoint
var app = express();
app.use(
  "/graphql",
  express_graphql({
    schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000, () =>
  console.log("Express GraphQL Server Now Running On localhost:4000/graphql")
);
