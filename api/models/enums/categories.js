/**
 * Enumerated Class for Article Categories
 */
export default class Category {
  static ArtificialIntelligence = new Category("artificial_intelligence");
  static Biology = new Category("biology");
  static Chemistry = new Category("chemistry");
  static ComputerScience = new Category("computer_science");
  static Culture = new Category("culture");
  static Health = new Category("environment");
  static Environment = new Category("environment");
  static Medicine = new Category("medicine");
  static Newsletter = new Category("environment");
  static Opinion = new Category("opinion");
  static Physics = new Category("physics");
  static Psychology = new Category("psychology");
  static Space = new Category("space");
  static Technology = new Category("technology");

  /**
   * INTERNAL USE ONLY
   * Construct a category enum
   *
   * @param {String} category
   */
  constructor(category) {
    this.category = category;
  }

  /**
   * Cateogory into its associated string
   *
   * @returns {String}
   */
  toString() {
    return this.category;
  }

  /**
   * String into its associated Category object
   *
   * @param {String} str
   * @returns {Cateogory}
   */
  static toCategory(str) {
    switch (str.toLowerCase()) {
      case this.ArtificialIntelligence.toString():
        return this.ArtificialIntelligence;
      case this.Biology.toString():
        return this.Biology;
      case this.Chemistry.toString():
        return this.Chemistry;
      case this.ComputerScience.toString():
        return this.ComputerScience;
      case this.Culture.toString():
        return this.Culture;
      case this.Health.toString():
        return this.Health;
      case this.Environment.toString():
        return this.Environment;
      case this.Medicine.toString():
        return this.Medicine;
      case this.Newsletter.toString():
        return this.Newsletter;
      case this.Opinion.toString():
        return this.Opinion;
      case this.Physics.toString():
        return this.Physics;
      case this.Psychology.toString():
        return this.Psychology;
      case this.Space.toString():
        return this.Space;
      case this.Technology.toString():
        return this.Technology;
      default:
    }
  }

  /**
   * Returns all category objects as a list.
   *
   * @returns {List[Category]}
   */
  static list() {
    return Object.values(this);
  }

  /**
   * Returns all categories as a list of strings
   */
  static listr() {
    return Object.values(this).map((val) => val.toString());
  }
}
