import { integer, string } from "./schemaTypes.js";

/**
 *  incoming validation schema (used in post requests, creating a new issue map)
 */
export const issueMapValidationSchema = {
  issueNumber: { type: integer, required: true },
  issueName: { type: string, required: true },
  sections: [
    {
      sectionName: { type: string, required: true },
      color: { type: string, required: true }, // modified sectionColor -> color to match dbmodel valiation schema
    },
  ],
};
