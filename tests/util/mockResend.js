/**
 * Mock replacement for the "resend" package, wired in via
 * jest.config.js's moduleNameMapper so tests never hit the
 * real Resend API.
 */
export class Resend {
  constructor() {}

  emails = {
    send: async () => ({ data: { id: "mock-email-id" }, error: null }),
  };
}
