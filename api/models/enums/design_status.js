/**
 * Enumerated Class for Design Statuses
 */
export default class DesignStatus {
  static Needs_Designer = new DesignStatus("needs_designer");
  static Has_Designer = new DesignStatus("has_designer");
  static In_Progress = new DesignStatus("in_progress");
  static Completed = new DesignStatus("completed");

  // Get all DesignStatuses
  static list = [this.Needs_Designer, this.Has_Designer, this.In_Progress, this.Completed];
  static listStr = this.list.map((status) => {
    return status.status;
  });

  /**
   * INTERNAL USE ONLY
   * Construct a DesignStatus enum
   *
   * @param {String} status
   */
  constructor(status) {
    this.status = status;
  }

  /**
   * DesignStatus to its associated string
   *
   * @returns {String}
   */
  toString() {
    return this.status;
  }

  /**
   * String to its associated DesginStatus object
   *
   * @param {String} str
   * @returns {DesignStatus}
   */
  static toDesignStatus(str) {
    switch (str.toLowerCase()) {
      case this.Needs_Designer.status:
        return this.Needs_Designer;
      case this.Has_Designer.status:
        return this.Has_Designer;
      case this.In_Progress.status:
        return this.In_Progress;
      case this.Completed.status:
        return this.Completed;
      default:
    }
  }

  /**
   * Returns all DesignStatus objects as a list.
   *
   * @returns {List[DesignStatus]}
   */
  static list() {
    return Object.values(this);
  }

  /**
   * Returns all DesignStatus as a list of strings
   */
  static listr() {
    return Object.values(this).map((val) => val.toString());
  }
}
