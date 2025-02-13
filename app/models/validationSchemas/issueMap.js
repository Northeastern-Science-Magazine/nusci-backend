import { number, string, array } from "./schemaTypes";

/**
 *  incoming validation schema (used in post requests, creating a new issue map) 
 */
export const issueMapValidationSchema = {
    issueNumber: { type: number, required: true },
    issueName: { type: string, required: true },
    sections: {
      type: array,
      items:
        {
          sectionName: { type: string, required: true},
          sectionColor: { type: string, required: true}
        }
    },
    /**
     *  fields such as creationTime, modificationTime, creatingUser, articles are all required,
     *  should I add these to the validationSchema that I check the controller request against, or generate them myself, etc?
     * 
     */
     
  };