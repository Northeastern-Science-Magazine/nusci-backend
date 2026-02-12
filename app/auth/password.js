import bcrypt from "bcryptjs"; // import bcrypt to hash passwords

export default class Password {
  /**
   * Hashes the password
   * @param password password from request
   * @param salt Salt length to generate
   * @returns hashed password
   */
  static async hash(password, salt) {
    return await bcrypt(password, salt);
  }

  /**
   * Check if passwords match
   * @param trial the password to match
   * @param hashedPassword the hashed password to comapre to
   * @returns whether the passwords match
   */
  static async compare(trial, hashedPassword) {
    return await bcrypt.compare(trial, hashedPassword);
  }
}
