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
          new mongoose.Types.ObjectId("a00000000000000000000001"),
          new mongoose.Types.ObjectId("a00000000000000000000002"),
        ],
        creationTime: new Date("2024-04-02"),
        modificationTime: new Date("2024-04-02"),
      },
      {
        sectionName: "Action Items",
        color: "#3366FF",
        creatingUser: new mongoose.Types.ObjectId("b00000000000000000000000"),
        articles: [],
        creationTime: new Date("2024-04-02"),
        modificationTime: new Date("2024-04-02"),
      },
    ],
    articles: [new mongoose.Types.ObjectId("a00000000000000000000000")],
    pages: 5,
    creatingUser: new mongoose.Types.ObjectId("b00000000000000000000000"),
    creationTime: new Date("2024-04-01"),
    modificationTime: new Date("2024-04-01"),
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
        articles: [],
        creationTime: new Date("2024-04-03"),
        modificationTime: new Date("2024-04-03"),
      },
      {
        sectionName: "Decorations",
        color: "#FF3366",
        creatingUser: new mongoose.Types.ObjectId("b00000000000000000000001"),
        articles: [new mongoose.Types.ObjectId("a00000000000000000000004")],
        creationTime: new Date("2024-04-04"),
        modificationTime: new Date("2024-04-04"),
      },
    ],
    articles: [
      new mongoose.Types.ObjectId("a00000000000000000000003"),
      new mongoose.Types.ObjectId("a00000000000000000000005"),
    ],
    pages: 7,
    creatingUser: new mongoose.Types.ObjectId("b00000000000000000000001"),
    creationTime: new Date("2024-04-03"),
    modificationTime: new Date("2024-04-03"),
  },
];
