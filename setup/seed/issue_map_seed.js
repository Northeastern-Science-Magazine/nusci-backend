import mongoose from "mongoose";

export default [
  {
    _id: new mongoose.Types.ObjectId("d00000000000000000000000"),
    issueNumber: 1,
    issueName: "Meeting with Team",
    sections: [
      {
        sectionName: "Project Discussion",
        color: "#FF5733",
        creatingUser: new mongoose.Types.ObjectId("b00000000000000000000000"),
        articles: [
          new mongoose.Types.ObjectId("a00000000000000000000000"),
          new mongoose.Types.ObjectId("a00000000000000000000001"),
        ],
        creationTime: new Date(),
        modificationTime: new Date(),
      },
      {
        sectionName: "Action Items",
        color: "#3366FF",
        creatingUser: new mongoose.Types.ObjectId("b00000000000000000000000"),
        articles: [new mongoose.Types.ObjectId("a00000000000000000000002")],
        creationTime: new Date(),
        modificationTime: new Date(),
      },
    ],
    articles: [
      new mongoose.Types.ObjectId("a00000000000000000000000"),
      new mongoose.Types.ObjectId("a00000000000000000000001"),
      new mongoose.Types.ObjectId("a00000000000000000000002"),
    ],
    pages: 5,
    creatingUser: new mongoose.Types.ObjectId("b00000000000000000000000"),
    creationTime: new Date(),
    modificationTime: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId("d00000000000000000000001"),
    issueNumber: 2,
    issueName: "Club Holiday Party",
    sections: [
      {
        sectionName: "Event Planning",
        color: "#33FF66",
        creatingUser: new mongoose.Types.ObjectId("b00000000000000000000001"),
        articles: [new mongoose.Types.ObjectId("a00000000000000000000003")],
        creationTime: new Date(),
        modificationTime: new Date(),
      },
      {
        sectionName: "Decorations",
        color: "#FF3366",
        creatingUser: new mongoose.Types.ObjectId("b00000000000000000000001"),
        articles: [
          new mongoose.Types.ObjectId("a00000000000000000000004"),
          new mongoose.Types.ObjectId("a00000000000000000000005"),
        ],
        creationTime: new Date(),
        modificationTime: new Date(),
      },
    ],
    articles: [
      new mongoose.Types.ObjectId("a00000000000000000000003"),
      new mongoose.Types.ObjectId("a00000000000000000000004"),
      new mongoose.Types.ObjectId("a00000000000000000000005"),
    ],
    pages: 7,
    creatingUser: new mongoose.Types.ObjectId("b00000000000000000000001"),
    creationTime: new Date(),
    modificationTime: new Date(),
  },
];
