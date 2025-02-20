import { number, string, array } from "./schemaTypes";

/**
 *  incoming validation schema (used in post requests, creating a new issue map) 
 */
export const issueMapValidationSchema = {
  issueNumber: { type: number, required: true },
  issueName: { type: string, required: true },
  sections: [
    {
      sectionName: { type: string, required: true},
      sectionColor: { type: string, required: true}
    }],
};