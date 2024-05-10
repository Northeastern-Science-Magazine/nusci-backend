import mongoose from "mongoose";

export default [
  {
    tagName: "Nature",
    color: "#4CAF50",
    creatingUser: new mongoose.Types.ObjectId(),
    creationTime: new Date(),
    modificationTime: new Date(),
  },
  {
    tagName: "Travel",
    color: "#FFC107",
    creatingUser: new mongoose.Types.ObjectId(),
    creationTime: new Date(),
    modificationTime: new Date(),
  },
  {
    tagName: "Food",
    color: "#FF5722",
    creatingUser: new mongoose.Types.ObjectId(),
    creationTime: new Date(),
    modificationTime: new Date(),
  },
  {
    tagName: "Architecture",
    color: "#03A9F4",
    creatingUser: new mongoose.Types.ObjectId(),
    creationTime: new Date(),
    modificationTime: new Date(),
  },
];