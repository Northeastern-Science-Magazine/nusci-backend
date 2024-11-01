import { validate } from "jsonschema";
import { object } from "./schemaTypes.js";
import { ErrorValidation } from "../../error/errors.js";

/**
 * Instructions for populating override fields on an object.
 *
 * @param {JSON} instance
 * @param {Array} overrideFields
 */
const populateOverrides = (instance, overrideFields) => {
  const overrideMapping = {
    creationTime: () => new Date(),
    modificationTime: () => new Date(),
  };

  for (const field of overrideFields) {
    instance[field] = overrideMapping[field]();
  }
};

/**
 * validateJSON method
 *
 * Custom wrapper function for the `jsonschema` `validate` method.
 * Defines a simple implementation of the `validate` method, which assumes an
 * object type, and takes in the simple properties object of a `jsonschema`.
 *
 * Given an object of `options`, will execute them as defined in this function.
 *
 * @param {JSON} instance object to validate
 * @param {JSON} schema definition - types
 * @param {JSON} options override values + other optional options
 * @returns
 */
export default function validateJSON(instance, schema, options) {
  try {
    options?.override && populateOverrides(instance, options.override);
    return validate(instance, { type: object, properties: schema });
  } catch (e) {
    throw new ErrorValidation(e);
  }
}
