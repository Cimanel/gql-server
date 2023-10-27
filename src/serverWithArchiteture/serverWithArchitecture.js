import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { graphqlHTTP as express_graphql } from "express-graphql";
import { graphql } from "graphql";
import serverResolvers from "./resolvers.js";
import serverTypeDefs from "./typeDefs.js";



const typeDefs = [serverTypeDefs];
const resolvers = [serverResolvers];

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const queryToExecute = `query($age: Int, $friendsAge: Int) { 
  characters (age: $age ){ 
    name ,
    shortGender,
    friends(age:$friendsAge) {name}
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
