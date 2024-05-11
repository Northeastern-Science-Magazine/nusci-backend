import mongoose from "mongoose";

export default [
  {
    _id: new mongoose.Types.ObjectId("f00000000000000000000000"),
    tagName: "Nature",
    color: "#4CAF50",
    creatingUser: new mongoose.Types.ObjectId("b00000000000000000000007"),
    creationTime: new Date(),
    modificationTime: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId("f00000000000000000000001"),
    tagName: "Travel",
    color: "#FFC107",
    creatingUser: new mongoose.Types.ObjectId("b00000000000000000000007"),
    creationTime: new Date(),
    modificationTime: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId("f00000000000000000000002"),
    tagName: "Food",
    color: "#FF5722",
    creatingUser: new mongoose.Types.ObjectId("b00000000000000000000007"),
    creationTime: new Date(),
    modificationTime: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId("f00000000000000000000003"),
    tagName: "Architecture",
    color: "#03A9F4",
    creatingUser: new mongoose.Types.ObjectId("b00000000000000000000007"),
    creationTime: new Date(),
    modificationTime: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId("f00000000000000000000004"),
    tagName: "Art",
    color: "#9C27B0",
    creatingUser: new mongoose.Types.ObjectId("b00000000000000000000007"),
    creationTime: new Date(),
    modificationTime: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId("f00000000000000000000005"),
    tagName: "Technology",
    color: "#009688",
    creatingUser: new mongoose.Types.ObjectId("b00000000000000000000007"),
    creationTime: new Date(),
    modificationTime: new Date(),
  }
];