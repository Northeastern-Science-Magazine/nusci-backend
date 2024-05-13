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
  static Designer = new Accounts("designer");
  static Admin = new Accounts("admin");

  // Get all Account Types
  static list = [this.Author, this.Editor, this.Photographer, this.Developer, this.Designer, this.Admin];
  static listStr = this.list.map((role) => {
    return role.role;
  });

  /**
   * INTERNAL USE ONLY
   * Construct an Account enum
   *
   * @param {String} role
   */
  constructor(role) {
    this.role = role;
  }

  /**
   * String into its associated Account object
   *
   * @param {String} str
   * @returns {Accounts}
   */
  static toAccount(str) {
    switch (str.toLowerCase()) {
      case this.Author.toString():
        return this.Author;
      case this.Editor.toString():
        return this.Editor;
      case this.Photographer.toString():
        return this.Photographer;
      case this.Developer.toString():
        return this.Developer;
      case this.Designer.toString():
        return this.Designer;
      case this.Admin.toString():
        return this.Admin;
      default:
        return this.None;
    }
  }

  /**
   * Returns all Accounts objects as a list.
   *
   * @returns {List[Accounts]}
   */
  static list() {
    return Object.values(this);
  }

  /**
   * Returns all Accounts as a list of strings
   */
  static listr() {
    return Object.values(this).map((val) => val.toString());
  }
}
