import { ErrorValidation } from "../../error/errors.js";

/**
 * Enumerated Class for Article Categories
 */
export default class Category {
  static Biology = new Category("biology");
  static Chemistry = new Category("chemistry");
  static Culture = new Category("culture");
  static Environment = new Category("environment");
  static Health = new Category("health");
  static Local = new Category("local");
  static Mathematics = new Category("mathematics");
  static Neuroscience = new Category("neuroscience");
  static Newsletter = new Category("newsletter");
  static Opinion = new Category("opinion");
  static Philosophy = new Category("philosophy");
  static Physics = new Category("physics");
  static Politics = new Category("politics");
  static Psychology = new Category("psychology");
  static Space = new Category("space");
  static Technology = new Category("technology");
  static Uncategorized = new Category("uncategorized");
  static World = new Category("world");

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
    const category = this.list().find(obj => obj.toString() === str.toLowerCase());
    if (!category) {
      throw new ErrorValidation("Invalid Category enum given.");
    }
    return category;
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
