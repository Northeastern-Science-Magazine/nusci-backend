import mongoose from "mongoose";

const PitchSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "article-pitch" },
    recipientIds: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  {
    collection: "pitchSettings",
    timestamps: true,
  }
);

const db = mongoose.connection.useDb("email");
const PitchSettings = db.model("PitchSettings", PitchSettingsSchema);

export default PitchSettings;