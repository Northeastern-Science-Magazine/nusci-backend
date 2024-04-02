import Acc from "./accounts.js";

/**
 * Permission class
 *
 * Handles a single instance of a permission
 */
class Permission {
  /**
   * Constructor for a Route Permission
   *
   * Permission field is a string that should correspond to the
   * permission name given in the router file.
   *
   * Roles that have permission to access this route should be added as
   * a list.
   *
   * @param {String} permission permission to give
   * @param {Array of Accounts} roles roles that have this permission
   */
  constructor(permission, roles) {
    this.permission = permission;
    this.roles = roles;
  }

  /**
   * Check method
   *
   * Checks if the given role has *this* permission
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
 * Handles the set of permissions that exist on all routers
 */
export default class ProtectedRoutes {
  /**
   * static field permissions
   *
   * Set of all permissions on this website. Constructed as an array
   * of Permission objects. If you want to add another protected route,
   * this is the place to add it.
   */
  static routes = [
    new Permission("GET profile", [Acc.Author, Acc.Editor, Acc.Photographer, Acc.Developer, Acc.Admin]),
    new Permission("GET approve-user", [Acc.Admin]),
    new Permission("POST approve-user", [Acc.Admin]),
    new Permission("GET submit-article", [Acc.Editor, Acc.Admin]),
    new Permission("POST submit-article", [Acc.Editor, Acc.Admin]),
    new Permission("GET deactivate-profile", [Acc.Author, Acc.Editor, Acc.Photographer, Acc.Developer, Acc.Admin]),
    new Permission("POST deactivate-profile", [Acc.Author, Acc.Editor, Acc.Photographer, Acc.Developer, Acc.Admin]),
    new Permission("GET deactivate", [Acc.Author, Acc.Editor, Acc.Photographer, Acc.Developer, Acc.Admin]),
    new Permission("POST deactivate", [Acc.Author, Acc.Editor, Acc.Photographer, Acc.Developer, Acc.Admin]),
    new Permission("GET delete-profile", [Acc.Author, Acc.Editor, Acc.Photographer, Acc.Developer, Acc.Admin]),
    new Permission("POST delete-profile", [Acc.Author, Acc.Editor, Acc.Photographer, Acc.Developer, Acc.Admin]),
    new Permission("GET delete", [Acc.Author, Acc.Editor, Acc.Photographer, Acc.Developer, Acc.Admin]),
    new Permission("POST delete", [Acc.Author, Acc.Editor, Acc.Photographer, Acc.Developer, Acc.Admin]),
  ];

  /**
   * Check method
   *
   * Checks if the given role has the given permission
   * Checks all permissions
   *
   * @param {String} permission
   * @param {Accounts} role
   * @returns {Boolean}
   */
  static check(permission, role) {
    let output = false;
    for (const p of ProtectedRoutes.routes) {
      output = output || p.check(permission, role);
    }
    return output;
  }
}
