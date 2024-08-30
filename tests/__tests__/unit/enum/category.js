import { log } from "../../../testConfig.js";
import Category from "../../../../app/models/enums/categories.js";
import { ErrorValidation } from "../../../../app/error/errors.js";


describe("Tests for enumerated type Category", () => {
  test("toString ArtificialIntelligence", () => {
    expect(Category.ArtificialIntelligence.toString()).toStrictEqual("artificial_intelligence");
  });

  test("toString Biology", () => {
    expect(Category.Biology.toString()).toStrictEqual("biology");
  });

  test("toString Chemistry", () => {
    expect(Category.Chemistry.toString()).toStrictEqual("chemistry");
  });

  test("toString ComputerScience", () => {
    expect(Category.ComputerScience.toString()).toStrictEqual("computer_science");
  });

  test("toString Culture", () => {
    expect(Category.Culture.toString()).toStrictEqual("culture");
  });

  test("toString Health", () => {
    expect(Category.Health.toString()).toStrictEqual("health");
  });

  test("toString Environment", () => {
    expect(Category.Environment.toString()).toStrictEqual("environment");
  });

  test("toString Medicine", () => {
    expect(Category.Medicine.toString()).toStrictEqual("medicine");
  });

  test("toString Newsletter", () => {
    expect(Category.Newsletter.toString()).toStrictEqual("newsletter");
  });

  test("toString Opinion", () => {
    expect(Category.Opinion.toString()).toStrictEqual("opinion");
  });

  test("toString Physics", () => {
    expect(Category.Physics.toString()).toStrictEqual("physics");
  });

  test("toString Psychology", () => {
    expect(Category.Psychology.toString()).toStrictEqual("psychology");
  });

  test("toString Science", () => {
    expect(Category.Science.toString()).toStrictEqual("science");
  });

  test("toString Space", () => {
    expect(Category.Space.toString()).toStrictEqual("space");
  });

  test("toString Technology", () => {
    expect(Category.Technology.toString()).toStrictEqual("technology");
  });

  test("toCategory ArtificialIntelligence", () => {
    expect(Category.toCategory("artificial_intelligence")).toStrictEqual(Category.ArtificialIntelligence);
  });

  test("toCategory Biology", () => {
    expect(Category.toCategory("biology")).toStrictEqual(Category.Biology);
  });

  test("toCategory Chemistry", () => {
    expect(Category.toCategory("chemistry")).toStrictEqual(Category.Chemistry);
  });

  test("toCategory ComputerScience", () => {
    expect(Category.toCategory("computer_science")).toStrictEqual(Category.ComputerScience);
  });

  test("toCategory Culture", () => {
    expect(Category.toCategory("culture")).toStrictEqual(Category.Culture);
  });

  test("toCategory Health", () => {
    expect(Category.toCategory("health")).toStrictEqual(Category.Health);
  });

  test("toCategory Environment", () => {
    expect(Category.toCategory("environment")).toStrictEqual(Category.Environment);
  });

  test("toCategory Medicine", () => {
    expect(Category.toCategory("medicine")).toStrictEqual(Category.Medicine);
  });

  test("toCategory Newsletter", () => {
    expect(Category.toCategory("newsletter")).toStrictEqual(Category.Newsletter);
  });

  test("toCategory Opinion", () => {
    expect(Category.toCategory("opinion")).toStrictEqual(Category.Opinion);
  });

  test("toCategory Physics", () => {
    expect(Category.toCategory("physics")).toStrictEqual(Category.Physics);
  });

  test("toCategory Psychology", () => {
    expect(Category.toCategory("psychology")).toStrictEqual(Category.Psychology);
  });

  test("toCategory Science", () => {
    expect(Category.toCategory("science")).toStrictEqual(Category.Science);
  });

  test("toCategory Space", () => {
    expect(Category.toCategory("space")).toStrictEqual(Category.Space);
  });

  test("toCategory Technology", () => {
    expect(Category.toCategory("technology")).toStrictEqual(Category.Technology);
  });

  test("toCategory invalid input", () => {
    expect(() => {
      Category.toCategory("invalid");
    }).toThrow(ErrorValidation);
  });

  test("list Category", () => {
    expect(Category.list()).toStrictEqual([
      Category.ArtificialIntelligence,
      Category.Biology,
      Category.Chemistry,
      Category.ComputerScience,
      Category.Culture,
      Category.Health,
      Category.Environment,
      Category.Medicine,
      Category.Newsletter,
      Category.Opinion,
      Category.Physics,
      Category.Psychology,
      Category.Science,
      Category.Space,
      Category.Technology,
    ]);
  });

  test("listr Category", () => {
    expect(Category.listr()).toStrictEqual([
      "artificial_intelligence",
      "biology",
      "chemistry",
      "computer_science",
      "culture",
      "health",
      "environment",
      "medicine",
      "newsletter",
      "opinion",
      "physics",
      "psychology",
      "science",
      "space",
      "technology",
    ]);
  });
});
