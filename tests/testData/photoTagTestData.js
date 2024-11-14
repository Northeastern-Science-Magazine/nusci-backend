export const validTag = {
  tagName: "Clouds",
  color: "#4CAF51",
  creatingUser: "b00000000000000000000001",
  creationTime: new Date("2024-04-06"), 
  modificationTime: new Date("2024-04-07"),
};

export const expectedValidTag = {
  tagName: "Clouds",
  color: "#4CAF51",
  creatingUser: {
    firstName: "Raisa",
    lastName: "B",
    pronouns: [],
    graduationYear: 2025,
    major: "Computer Science and Mathematics",
    location: "New York",
    profileImage: "https://example.com/profile.jpg",
    bannerImage: "https://example.com/banner.jpg",
    bio: "Co-Head of Web & Software with Ethan",
    email: 'raisa@raisa.com',
    roles: ["admin"],
    creationTime: "2024-02-27T00:00:00.000Z",
    modificationTime: "2024-02-27T00:00:00.000Z",
  },
  creationTime: validTag.creationTime,
  modificationTime: validTag.modificationTime,
};

export const validTag2 = {
  tagName: "Clouds",
  color: "#FFC107",
  creatingUser: "b00000000000000000000000",
  creationTime: new Date("2024-04-06"),
  modificationTime: new Date("2024-04-07"),
};

export const expectedValidTag2 = {
  tagName: "Clouds",
  color: "#FFC107",
  creatingUser: {
    firstName: "Ethan",
    lastName: "S",
    pronouns: [],
    graduationYear: 2026,
    major: "Computer Science and Mathematics",
    location: "New Jersey",
    profileImage: "https://example.com/profile.jpg",
    bannerImage: "https://example.com/banner.jpg",
    bio: "Co-Head of Web & Software with Raisa",
    email: "ethan@ethan.com",
    roles: ["admin"],
    creationTime: "2024-02-27T00:00:00.000Z",
    modificationTime: "2024-02-27T00:00:00.000Z",
  },
  creationTime: validTag2.creationTime,
  modificationTime: validTag2.modificationTime,
};

export const validTag3 = {
  tagName: "Filler",
  color: "#4CAF51",
  creatingUser: "b00000000000000000000001",
  creationTime: new Date("2024-04-06"), 
  modificationTime: new Date("2024-04-07"),
};

export const expectedValidTag3 = {
  tagName: "Filler",
  color: "#4CAF51",
  creatingUser: {
    firstName: "Raisa",
    lastName: "B",
    pronouns: [],
    graduationYear: 2025,
    major: "Computer Science and Mathematics",
    location: "New York",
    profileImage: "https://example.com/profile.jpg",
    bannerImage: "https://example.com/banner.jpg",
    bio: "Co-Head of Web & Software with Ethan",
    email: 'raisa@raisa.com',
    roles: ["admin"],
    creationTime: "2024-02-27T00:00:00.000Z",
    modificationTime: "2024-02-27T00:00:00.000Z",
  },
  creationTime: validTag3.creationTime,
  modificationTime: validTag3.modificationTime,
};
