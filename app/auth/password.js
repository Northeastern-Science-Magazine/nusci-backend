import bcrypt from "bcryptjs";

/**
 * Password class
 *
 * Contains methods that are used to hash passwords 
 * and compare passwords 
 * 
 */
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
