import bcrypt from 'bcryptjs';

class Password {
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  async hash(password) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(trial, hashedPassword) {
    return await bcrypt.compare(trial, hashedPassword);
  }
}

export default Password;
