/**
 * Enumerated Class for Account Types
 */
export default class Accounts {
  static Author = new Accounts("author");
  static Editor = new Accounts("editor");
  static Photographer = new Accounts("photographer");
  static Developer = new Accounts("developer");
  static Admin = new Accounts("admin");

  constructor(role) {
    this.role = role;
  }
}
