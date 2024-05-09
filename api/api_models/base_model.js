/**
 * BaseModel Abstract Class
 *
 * This class serves as the parent class for all other API Models.
 */
export default class BaseModel {
  static validateModel(json, schema) {
    for (const key in schema) {
      const { type, required, enum: enumValues } = schema[key];
      const value = json[key];

      if (required && value === undefined) {
        throw new Error(`Field '${key}' is required.`);
      }

      if (value === undefined && !required) {
        continue; // Skip validation for undefined values if not required
      }

      if (value === undefined && required) {
        // might want to address this
        throw new Error(`Field '${key}' must be of type 'undefined'.`);
      }

      if (enumValues && !enumValues.includes(value)) {
        throw new Error(`Invalid value '${value}' for field '${key}'. Must be one of: ${enumValues.join(", ")}`);
      }

      if (Array.isArray(type)) {
        if (!Array.isArray(value)) {
          throw new Error(`Field '${key}' must be an array.`);
        }
        if (value.length === 0) {
          throw new Error(`Field '${key}' cannot be an empty array.`);
        }
        const elementType = type[0];
        for (const item of value) {
          if (typeof elementType === "object") {
            if (typeof item !== "object") {
              throw new Error(`Elements of '${key}' array must be objects.`);
            }
            validateModel(item, elementType);
          } else {
            if (typeof item !== elementType) {
              throw new Error(`Elements of '${key}' array must be of type '${elementType}'.`);
            }
          }
        }
      } else if (typeof type === "object") {
        if (typeof value !== "object" || Array.isArray(value)) {
          throw new Error(`Field '${key}' must be an object.`);
        }
        validateModel(value, type);
      } else {
        if (typeof value !== type) {
          if (typeof value === "object") {
            validateModel(value, schema[key]); // Recursively validate nested object
          } else {
            throw new Error(`Field '${key}' must be of type '${type}'.`);
          }
        }
      }
    }
  }

  toJSON() {
    throw new Error("Method 'toJSON()' not implemented!");
  }
}
