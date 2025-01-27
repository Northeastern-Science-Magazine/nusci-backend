/**
 *  Incoming/Outgoing validation schema (used in post requests, creating a new issue map) 
 */
export const issueMapValidationSchema = {
    issueNumber: { type: number, required: true },
    issueName: { type: string, required: true },
    sections: {
      type: [
        {
          sectionName: { type: string},
          sectionColor: { type: string}
        }
      ],
    },
  };