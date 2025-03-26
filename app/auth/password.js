import bcrypt from "bcryptjs";

/**
 * Password class
 *
 * Contains methods that are used to hash passwords 
 * and compare passwords 
 * 
 */
export class Password {

  /**
   * hash method
   *
   * Takes in a password (string) and return a hashed password.
   *
   * @param {String} password
   * @returns {String} encrypted 
   */    
  static async hash(password) {
    const encrypted = await bcrypt.hash(password, 10);
    return encrypted;
  }

  /**
   * compare method 
   *
   * Takes in a 'trial' and the encrypted password, and 
   * returns true or false whether or not it is a valid password.
   * 
   * @param {String} trial 
   * @param {String} encrypted 
   * @returns {boolean} valid 
   */
  static async compare(trial, encrypted) {
    const valid = await bcrypt.compare(trial, encrypted);
    return valid;
  }
}
