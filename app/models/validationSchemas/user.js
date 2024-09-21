const object = "object",
  string = "string",
  array = "array",
  integer = "integer";

const userCreate = {
  id: "/user/create",
  type: object,
  properties: {
    firstName: { type: string },
    lastName: { type: string },
    username: { type: string },
    password: { type: string },
    pronouns: { type: array, items: string },
    graduationYear: { type: integer },
  },
};
