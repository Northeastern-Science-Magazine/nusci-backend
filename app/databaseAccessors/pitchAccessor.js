import Connection from "../db/connection.js";
import User from "../models/dbModels/user.js";
import PitchSettings from "../models/dbModels/pitchSettings.js";
import Accounts from "../models/enums/accounts.js";

const SETTINGS_ID = "article-pitch";

export default class PitchAccessor {
  static async getEligibleRecipients() {
    await Connection.open();

    return User.find({
      roles: Accounts.Admin.toString(),
      graduationYear: { $gte: new Date().getFullYear() },
    })
      .select("_id firstName lastName email")
      .sort({ firstName: 1, lastName: 1 })
      .lean();
  }

  static async getSelectedRecipients(recipientIds) {
    await Connection.open();

    return User.find({
      _id: { $in: recipientIds },
      roles: Accounts.Admin.toString(),
      graduationYear: { $gte: new Date().getFullYear() },
    })
      .select("email")
      .lean();
  }

  static async getSettings() {
    await Connection.open();

    return PitchSettings.findById(SETTINGS_ID).lean();
  }

  static async updateSettings(recipientIds) {
    await Connection.open();

    return PitchSettings.findByIdAndUpdate(
      SETTINGS_ID,
      { $set: { recipientIds } },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    ).lean();
  }
}