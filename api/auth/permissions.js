import Acc from "./accounts.js";

/**
 * Handles a single permission
 */
class Permission {
  /**
   *
   * @param {String} permission permission to give
   * @param {Array of Accounts} roles roles that have this permission
   */
  constructor(permission, roles) {
    this.permission = permission;
    this.roles = roles;
  }

  /**
   * Checks if the given role has the given permission
   *
   * @param {String} permission
   * @param {Array of Accounts} role
   * @returns {Boolean}
   */
  check(permission, role) {
    return this.permission === permission ? this.roles.includes(role) : false;
  }
}

/**
 * Handles the set of permissions
 */
export default class PermissionSet {
  static permissions = [
    new Permission("GET profile", [Acc.Author, Acc.Editor, Acc.Photographer, Acc.Developer, Acc.Admin]),
    new Permission("GET approve-user", [Acc.Admin]),
    new Permission("POST approve-user", [Acc.Admin]),
  ];

  static check(permission, role) {
    let output = false;
    for (const p of PermissionSet.permissions) {
      output = output || p.check(permission, role);
    }
    return output;
  }
}
