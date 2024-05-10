import mongoose from "mongoose";

export default [
  {
    url: "https://example.com/photo1.jpg",
    tags: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    photographers: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    photoTime: new Date("2024-05-10T10:00:00"),
    rights: "All rights reserved",
    creationTime: new Date(),
    modificationTime: new Date(),
  },
  {
    url: "https://example.com/photo2.jpg",
    tags: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    photographers: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    photoTime: new Date("2024-05-15T14:30:00"),
    rights: "All rights reserved",
    creationTime: new Date(),
    modificationTime: new Date(),
  },
  {
    url: "https://example.com/photo3.jpg",
    tags: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    photographers: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    photoTime: new Date("2024-06-01T08:45:00"),
    rights: "All rights reserved",
    creationTime: new Date(),
    modificationTime: new Date(),
  },
  {
    url: "https://example.com/photo4.jpg",
    tags: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    photographers: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    photoTime: new Date("2024-06-20T16:00:00"),
    rights: "All rights reserved",
    creationTime: new Date(),
    modificationTime: new Date(),
  },
  {
    url: "https://example.com/photo5.jpg",
    tags: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    photographers: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    photoTime: new Date("2024-07-05T11:20:00"),
    rights: "All rights reserved",
    creationTime: new Date(),
    modificationTime: new Date(),
  },
];
