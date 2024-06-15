import { ErrorInternalAPIModelFieldValidation } from "../../error/internal_errors.js";
import { ErrorInternalAPIModelValidation } from "../../error/internal_errors.js";

// Delegated Atomic Types
export const number = "number";
export const boolean = "boolean";
export const string = "string";
export const object = "object";
export const date = "date";
export const empty = "undefined";

/**
 * BaseModel Abstract Class
 *
 * This class serves as the parent class for all other API Models,
 * and provides static utility functions that API Models should have.
 *
 */
export class BaseModel {
  constructor(json, schema) {
    try {
      this.validate(json, schema);
      for (const key of Object.keys(json)) {
        this[key] = json[key];
      }
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
  }

  /**
   * METHOD LOOKING TO BE IMPROVED
   * - validate the fields and only the correct fields there (cut out invalid)
   * - validate more specific things that could go wrong (ex. non boolean in required)
   *
   * Given a Schema, this method will ensure the given JSON
   * conforms to the types defined in the schema. Throws an error
   * if improper type.
   *
   * @param {JSON} json
   * @param {JSON} schema
   */
  validate(json, schema) {
    for (const key in schema) {
      var value = json[key];
      const type = schema[key].type;
      const required = schema[key].required;
      const enumValues = schema[key].enum;
      const defaultValue = schema[key].default;
      const override = schema[key].override;

      if (value === undefined && (defaultValue !== undefined || override)) {
        json[key] = defaultValue;
        value = defaultValue;
      }

      if (required && value === undefined) {
        throw new ErrorInternalAPIModelFieldValidation(`Field '${key}' is required.`);
      }

      if (value === undefined && !required) {
        continue; // Skip validation for undefined values if not required
      }

      if (value === undefined && required) {
        // might want to review this
        throw new ErrorInternalAPIModelFieldValidation(`Field '${key}' must be of type 'undefined'.`);
      }

      if (enumValues) {
        if (!Array.isArray(value) && !enumValues.includes(value)) {
          throw new ErrorInternalAPIModelFieldValidation(
            `Invalid value '${value}' for field '${key}'. Must be one of: ${enumValues.join(", ")}`
          );
        } else if (Array.isArray(value) && !value.every((enumValue) => enumValues.includes(enumValue))) {
          throw new ErrorInternalAPIModelFieldValidation(
            `Invalid value '${value}' for field '${key}'. Must be list of: ${enumValues.join(", ")}`
          );
        }
      }

      if (Array.isArray(type)) {
        if (!Array.isArray(value)) {
          throw new ErrorInternalAPIModelFieldValidation(`Field '${key}' must be an array.`);
        }
        if (value.length === 0 && required) {
          throw new ErrorInternalAPIModelFieldValidation(`Field '${key}' cannot be an empty array.`);
        }
        const elementType = type[0];
        for (const item of value) {
          if (typeof elementType === "object") {
            if (typeof item !== "object") {
              throw new ErrorInternalAPIModelFieldValidation(`Elements of '${key}' array must be objects.`);
            }
            this.validate(item, elementType);
          } else {
            if (typeof item !== elementType) {
              throw new ErrorInternalAPIModelFieldValidation(`Elements of '${key}' array must be of type '${elementType}'.`);
            }
          }
        }
      } else if (typeof type === "object") {
        if (typeof value !== "object" || Array.isArray(value)) {
          throw new ErrorInternalAPIModelFieldValidation(`Field '${key}' must be an object.`);
        }
        this.validate(value, type);
      } else {
        if (typeof value !== type) {
          if (typeof value === "object") {
            this.validate(value, schema[key]); // Recursively validate nested object
          } else {
            if (type === "date" && !value instanceof Date) {
              throw new ErrorInternalAPIModelFieldValidation(`Field '${key}' must be a Date.`);
            } else {
              throw new ErrorInternalAPIModelFieldValidation(`Field '${key}' must be of type '${type}'.`);
            }
          }
        }
      }
    }
  }
}

export class BaseModelUpdate extends BaseModel {
  constructor(json, schema) {
    super(json, schema);
    this.validate(json);
  }

  /**
   * Validates that upon update, at least one
   * field is actually being updated.
   *
   * @param {JSON} json
   * @param {JSON} schema
   */
  validate(json) {
    if (!Object.values(json).some((value) => value !== undefined)) {
      throw new ErrorInternalAPIModelFieldValidation("Invalid update model.");
    }
  }
}
