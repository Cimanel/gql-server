import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { graphqlHTTP as express_graphql } from "express-graphql";
import { graphql } from "graphql";

const charactersData = [
  {
    id: 1,
    name: "Impa",
    age: 121,
    gender: "female",
    friends: [2, 3],
    animals: [
      { name: "Dog", bark: "Woof!" },
      { name: "Kitty", color: "green" },
    ],
  },
  { id: 2, name: "Daruk", age: 50, gender: "male", friends: [1, 3, 2] },
  { id: 3, name: "Revali", age: 21, gender: "male", friends: [1, 2, 4] },
  { id: 4, name: "Link", age: 17, gender: "male", friends: [3, 5] },
  { id: 5, name: "Zelda", age: 17, gender: "female", friends: [2, 4] },
];

var typeDefs = `#graphql
  type Character {
    name: String
    age: Int
    gender: String
    shortGender: String
    friends (age: Int): [Character]
    animals: [Animal]
  }

  
  union Animal = Dog | Cat
  type Dog {
    name: String
    bark: String
  }
  type Cat {
    name: String
    color: String
  }
  type Query {
    characters(age: Int): [Character]
  }
`;
//FIXME: The union type Animal is not working, Animal.name was defined in resolvers, but Animal is not an object or interface type
var resolvers = {
  Query: {
    characters(obj, args, context, info) {
      return args?.age
        ? charactersData.filter((character) => character.age === args.age)
        : charactersData;
    },
  },
  Character: {
    friends(obj, args, context, info) {
      //obj: The previous object, here: character
      const character = obj;
      console.log("args", args);
      console.log("variableValues", info.variableValues);
      const friends = charactersData.filter((characterData) =>
        character.friends.includes(characterData.id)
      );

      return args?.age
        ? friends.filter((friend) => friend.age === args.age)
        : friends;
    },
    shortGender(character) {
      return character.gender.charAt(0);
    },
  },
  Animal: {
    __resolveType(animal, contextValue, info) {
      // Only Author has a name field
      if (animal.bark) {
        return "Dog";
      }
      // Only Book has a title field
      if (animal.color) {
        return "Cat";
      }
      return null; // GraphQLError is thrown
    },
    name: (animal) => animal.name?.toUpperCase(),
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const queryToExecute = `query($age: Int, $friendsAge: Int) { 
  characters (age: $age ){ 
    name ,
    shortGender,
    friends(age:$friendsAge) {name},
    animals {
      name
    }
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
