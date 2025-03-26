import bcrypt from "bcryptjs";
export class Password {
  static async hash(password) {
    const encrypted = await bcrypt.hash(password, 10);
    return encrypted;
  }
  static async compare(trial, encrypted) {
    const valid = await bcrypt.compare(trial, encrypted);
    return valid;
  }
}
