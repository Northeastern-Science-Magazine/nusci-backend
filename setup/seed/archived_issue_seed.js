import mongoose from "mongoose";

// keys are placeholders: the files don't exist in S3, so their presigned URLs will 404
export default [
  {
    _id: new mongoose.Types.ObjectId("e00000000000000000000000"),
    issueNumber: 60,
    title: "Issue 60",
    publicationDate: new Date("2025-04-01"),
    pdfKey: "dev/archive/00000000-0000-0000-0000-000000000060.pdf",
    coverKey: "dev/archive/00000000-0000-0000-0000-000000000060.png",
    creatingUser: new mongoose.Types.ObjectId("b00000000000000000000000"),
    creationTime: new Date("2025-04-01"),
    modificationTime: new Date("2025-04-01"),
  },
  {
    _id: new mongoose.Types.ObjectId("e00000000000000000000001"),
    issueNumber: 59,
    title: "Issue 59",
    publicationDate: new Date("2024-12-01"),
    pdfKey: "dev/archive/00000000-0000-0000-0000-000000000059.pdf",
    creatingUser: new mongoose.Types.ObjectId("b00000000000000000000000"),
    creationTime: new Date("2024-12-01"),
    modificationTime: new Date("2024-12-01"),
  },
];
