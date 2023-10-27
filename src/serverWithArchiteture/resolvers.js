const charactersData = [
  { id: 1, name: "Impa", age: 121, gender: "female", friends: [2, 3] },
  { id: 2, name: "Daruk", age: 50, gender: "male", friends: [1, 3, 2] },
  { id: 3, name: "Revali", age: 21, gender: "male", friends: [1, 2, 4] },
  { id: 4, name: "Link", age: 17, gender: "male", friends: [3, 5] },
  { id: 5, name: "Zelda", age: 17, gender: "female", friends: [2, 4] },
];

const Query = {
  characters(obj, args, context, info) {
    return args?.age
      ? charactersData.filter((character) => character.age === args.age)
      : charactersData;
  },
};

const Character = {
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
};

export default { Query, Character };
