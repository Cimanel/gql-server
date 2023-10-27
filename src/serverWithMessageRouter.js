import { makeExecutableSchema } from "@graphql-tools/schema";
import express, { Router } from "express";
import { graphqlHTTP as express_graphql } from "express-graphql";
import { graphql } from "graphql";

var typeDefs = `
    type Query {
        message: String
    }
`;

var resolvers = {
  Query: {
    message(_, __, context) {
      console.log("context", context);
      return "Hello World!";
    },
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
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

const messageRouter = Router();

messageRouter.get("/", (req, res) => {
  const queryToExecute = "{ message }";
  graphql({
    schema: executableSchema,
    source: queryToExecute,
  }).then((response) => {
    console.log(JSON.stringify(response.data));
    return response;
  });
});

app.use("/message", messageRouter);

app.listen(4000, () =>
  console.log("Express GraphQL Server Now Running On localhost:4000/graphql")
);


