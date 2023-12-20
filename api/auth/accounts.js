/**
 * Enumerated Class for Account Types
 *
 * None - should never be part of a permission set
 * It is simply denoting that such a role does not exist.
 */
export default class Accounts {
  static None = new Accounts("none");
  static Author = new Accounts("author");
  static Editor = new Accounts("editor");
  static Photographer = new Accounts("photographer");
  static Developer = new Accounts("developer");
  static Admin = new Accounts("admin");

  constructor(role) {
    this.role = role;
  }

  /**
   * I know it seems redundant but having an
   * Accounts Class will hopefully keep our
   * middleware more organized
   *
   * @param {String} str
   */
  static toAccount(str) {
    switch (str.toLowerCase()) {
      case "author":
        return this.Author;
      case "editor":
        return this.Editor;
      case "photographer":
        return this.Photographer;
      case "developer":
        return this.Developer;
      case "admin":
        return this.Admin;
      default:
        return this.None;
    }
  }
}
