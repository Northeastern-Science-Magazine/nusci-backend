import Connection from "../api/db/connection.js";

export default class SetupHelper {
  /**
   *
   * @param {*} databases
   * @returns
   */
  static openConnections(databases) {
    let connections = [];
    databases.forEach((db) => {
      let connection = Connection.open(db);
      connections.push(connection);
    });
    return connections;
  }

  /**
   *
   * @param {*} connections
   */
  static closeConnections(connections) {
    connections.forEach((connection) => {
      Connection.close(connection);
    });
  }
}
