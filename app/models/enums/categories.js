import { ErrorValidation } from "../../error/errors.js";

/**
 * Enumerated Class for Article Categories
 */
export default class Category {
  static Biology = new Category("Biology");
  static Chemistry = new Category("Chemistry");
  static Culture = new Category("Culture");
  static Environment = new Category("Environment");
  static Health = new Category("Health");
  static Local = new Category("Local");
  static Mathematics = new Category("Mathematics");
  static Neuroscience = new Category("Neuroscience");
  static Newsletter = new Category("Newsletter");
  static Opinion = new Category("Opinion");
  static Philosophy = new Category("Philosophy");
  static Physics = new Category("Physics");
  static Politics = new Category("Politics");
  static Psychology = new Category("Psychology");
  static Space = new Category("Space");
  static Technology = new Category("Technology");
  static Uncategorized = new Category("Uncategorized");
  static World = new Category("World");
  static Interview = new Category("Interview");

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
    const category = this.list().find((obj) => obj.toString() === str.toLowerCase());
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
