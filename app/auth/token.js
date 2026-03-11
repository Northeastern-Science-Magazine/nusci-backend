import jwt from "jsonwebtoken"; // import jwt to sign tokens

export default class LoginToken {
  /**
   * Generate and signs a JWT token
   * @param user User with email and roles
   * @param {HTTP RES} res
   * @param cookie boolean for adding a cookie
   */
  static generate(user) {
    // encode email and roles
    const token = jwt.sign(
      {
        email: user.email,
        roles: user.roles,
      },
      process.env.SERVER_TOKEN_KEY
    );

    return ["token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 }];
  }
}
