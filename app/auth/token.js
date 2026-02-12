import jwt from "jsonwebtoken"; // import jwt to sign tokens

export default class LoginToken {
  /**
   * Generate and signs a JWT token
   * @param user User with email and roles
   * @param {HTTP RES} res
   * @param cookie boolean for adding a cookie
   */
  static generate(user, res, cookie) {
    const token = jwt.sign(
      {
        email: user.email,
        roles: user.roles,
      },
      process.env.SERVER_TOKEN_KEY
    );

    // check if res is valid and a cookie is wanted
    if (cookie && res) {
      res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    }
  }
}
