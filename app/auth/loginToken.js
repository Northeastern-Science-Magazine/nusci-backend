import jwt from "jsonwebtoken";
import { config as dotenvConfig } from "dotenv";

/**
 * LoginToken Class
 *
 * This class handles JWT token generation
 * and cookie configuration for user authentication.
 */
export default class LoginToken {
  /**
   * This method generates a signed JWT token
   * and returns cookie options.
   *
   * @param {Object} user - User object with email and roles
   * @returns {Object} Object containing token and cookieOptions
   */
  static generate(user) {
    dotenvConfig();

    // Sign the JWT token with user data
    const token = jwt.sign(
      {
        email: user.email,
        roles: user.roles,
      },
      process.env.SERVER_TOKEN_KEY
    );

    // Cookie configuration
    const cookieOptions = {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    };

    return { token, cookieOptions };
  }
}
