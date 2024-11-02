import { validate } from "jsonschema";
import { object } from "./schemaTypes.js";
import { ErrorValidation } from "../../error/errors.js";

/**
 * The design for validating income and outgoing data to this
 * web server.
 *
 * `incoming` defined as data coming to this server from the frontend.
 *
 * `outgoing` defined as data we are sending to any external requester.
 *
 * There is a reason for incoming and outgoing data to be validated differently.
 * Since the req.body might be different on every individual endpoint, there is
 * no use in making these schemas reusable, so they are defined inline at controller
 * methods. In order to make this less bulky, we assume this data comes in as an
 * object, so only the properties have to be defined to validate. Furthermore,
 * incoming data may need to have some things "added" before validation, like
 * creationTime, which can only be ascertained at runtime. Outgoing data might need
 * to be cleaned up from Mongoose, stripping away unecessary or unsafe data that
 * should not be returned to any external requester.
 */
export default class Validate {
  /**
   * Instructions for populating override fields on an object.
   * This is where you would add the resolvers for any overriding
   * data you need pre-validation.
   *
   * @param {JSON} instance
   * @param {Array} overrideFields
   */
  static _populateOverrides = (instance, overrideFields) => {
    const overrideMapping = {
      creationTime: () => new Date(),
      modificationTime: () => new Date(),
    };

    for (const field of overrideFields) {
      instance[field] = overrideMapping[field]();
    }
  };

  /**
   * validates incoming JSON, usually from the req.body of a controller.
   *
   * Custom wrapper function for the `jsonschema` `validate` method.
   * Defines a simple implementation of the `validate` method, which assumes an
   * object type, and takes in the simple properties object of a `jsonschema`.
   *
   * Given an object of `options`, will execute them as defined in this function.
   *
   * @param {JSON} instance object to validate
   * @param {JSON} schema definition (properties only)
   * @param {JSON} options override values + other optional options
   * @returns
   */
  static incoming(instance, schema, options) {
    try {
      options?.override && this._populateOverrides(instance, options.override);
      return validate(instance, { type: object, properties: schema });
    } catch (e) {
      throw new ErrorValidation(e);
    }
  }

  /**
   * Given an instance and a schema, this function will remove any fields from the
   * instnace that are not defined in the schema.
   *
   * @param {JSON} instance instance of object being stripped
   * @param {JSON} schema json schema definition for object's validation
   * @returns
   */
  static _removeExtraneousFields(instance, schema) {
    if (schema.type !== "object" || !schema.properties) return;
    for (const key in instance) if (!schema.properties[key]) delete instance[key];
  }

  /**
   * validates outgoing JSON, usually for data in an HTTP response from a controller
   *
   * Custom wrapper function for the `jsonschema` `validate` method.
   * Defines a implementation of the `validate` method with an opportunity for
   * pre and post processing of JSON data.
   *
   * Given an object of `options`, will execute them as defined in this function.
   *
   * If the given instance has extra fields not defined in the schema, they will by
   * default be removed. To keep extra fields (i.e. to preserve _id if not defined in schema),
   * add to the options object, `preserve: true` as a field.
   *
   * @param {JSON} instance object to validate
   * @param {JSON} schema json schema (full definition)
   * @param {JSON} options override values + other optional options
   * @returns
   */
  static outgoing(instance, schema, options) {
    try {
      !options?.preserve && this._removeExtraneousFields(instance, schema);
      return validate(instance, schema);
    } catch (e) {
      throw new ErrorValidation(e);
    }
  }
}
