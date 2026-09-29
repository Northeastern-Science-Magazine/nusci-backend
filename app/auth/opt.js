import crypto from "crypto";

export default class OTPToken {
  static TOKEN_BYTES = 32;
  static HASH_ALGO = "sha256";

  static generate() {
    const token = crypto.randomBytes(OTPToken.TOKEN_BYTES).toString("hex");
    const hash = OTPToken.hash(token);

    return { token, hash };
  }

  static hash(token) {
    return crypto.createHash(OTPToken.HASH_ALGO).update(token).digest("hex");
  }

  static compare(trialToken, storedHash) {
    const trialHash = OTPToken.hash(trialToken);

    const a = Buffer.from(trialHash, "hex");
    const b = Buffer.from(storedHash, "hex");

    if (a.length !== b.length) return false;

    return crypto.timingSafeEqual(a, b);
  }
}
