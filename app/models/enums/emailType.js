import { ErrorValidation } from "../../error/errors";

export default class EmailType {
    static Reminder = new EmailType("reminder");
    static Deadline = new EmailType("deadline");
    static Reset_Password = new EmailType("reset_password");
    static Invite_User = new EmailType("invite-user");
    static Custom = new EmailType("custom");

    /**
     * Email type enum constructor
     * @param {String} type 
     */
    constructor(type) {
        this.type = type;
    }
    
    /***
     * Email type to string
     * @returns {String}
     */
    toString() {
        return this.type;
    }

    /**
     * Lists email types.
     * @returns {List[EmailType]}
     */
    static list() {
        return Object.values(this);
    }

    /**
     * Lists email types in string value.
     */
    static listr() {
        return Object.values(this).map((type) => type.toString());
    }

    /**
     * Converts a string to its corresponding email type.
     * @param {String} str the string of the email type to find.
     */
    static toEmailType(str) {

        const emailType = Object.values(this).find((type) => type.toString() === str.toLowerCase())
        if (!emailType) {
            throw new ErrorValidation(`Type ${str} not found in email type enum.`);
        }
        return emailType;
    }

}   
