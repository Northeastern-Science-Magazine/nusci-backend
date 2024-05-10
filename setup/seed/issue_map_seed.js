import mongoose from "mongoose";

export default [
    {
      issueNumber: 1,
      issueName: "Meeting with Team",
      sections: [
        {
          sectionName: "Project Discussion",
          color: "#FF5733",
          creatingUser: new mongoose.Types.ObjectId(),
          articles: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
          creationTime: new Date(),
          modificationTime: new Date(),
        },
        {
          sectionName: "Action Items",
          color: "#3366FF",
          creatingUser: new mongoose.Types.ObjectId(),
          articles: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
          creationTime: new Date(),
          modificationTime: new Date(),
        }
      ],
      articles: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      pages: 5,
      creatingUser: new mongoose.Types.ObjectId(),
      creationTime: new Date(),
      modificationTime: new Date(),
    },
    {
      issueNumber: 2,
      issueName: "Club Holiday Party",
      sections: [
        {
          sectionName: "Event Planning",
          color: "#33FF66",
          creatingUser: new mongoose.Types.ObjectId(),
          articles: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
          creationTime: new Date(),
          modificationTime: new Date(),
        },
        {
          sectionName: "Decorations",
          color: "#FF3366",
          creatingUser: new mongoose.Types.ObjectId(),
          articles: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
          creationTime: new Date(),
          modificationTime: new Date(),
        }
      ],
      articles: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      pages: 7,
      creatingUser: new mongoose.Types.ObjectId(),
      creationTime: new Date(),
      modificationTime: new Date(),
    },
    {
      issueNumber: 3,
      issueName: "Monthly Team Meeting",
      sections: [
        {
          sectionName: "Monthly Review",
          color: "#FF9933",
          creatingUser: new mongoose.Types.ObjectId(),
          articles: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
          creationTime: new Date(),
          modificationTime: new Date(),
        },
        {
          sectionName: "Goal Setting",
          color: "#33FF99",
          creatingUser: new mongoose.Types.ObjectId(),
          articles: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
          creationTime: new Date(),
          modificationTime: new Date(),
        }
      ],
      articles: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      pages: 8,
      creatingUser: new mongoose.Types.ObjectId(),
      creationTime: new Date(),
      modificationTime: new Date(),
    },
    {
      issueNumber: 4,
      issueName: "Product Launch Event",
      sections: [
        {
          sectionName: "Launch Preparation",
          color: "#FF33CC",
          creatingUser: new mongoose.Types.ObjectId(),
          articles: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
          creationTime: new Date(),
          modificationTime: new Date(),
        },
        {
          sectionName: "Promotion",
          color: "#33CCFF",
          creatingUser: new mongoose.Types.ObjectId(),
          articles: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
          creationTime: new Date(),
          modificationTime: new Date(),
        }
      ],
      articles: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      pages: 10,
      creatingUser: new mongoose.Types.ObjectId(),
      creationTime: new Date(),
      modificationTime: new Date(),
    },
  ];