let users = [];

const userSchema = {
  title: "Define como é o usuário",
  type: "object",
  required: ["id", "name", "email", "age"],
  properties: {
    id: {
      type: "number",
    },
    name: {
      type: "string",
    },
    email: {
      type: "string",
    },
    age: {
      type: "number",
      minimum: 18,
    },
  },
};

module.exports = { users, userSchema };
