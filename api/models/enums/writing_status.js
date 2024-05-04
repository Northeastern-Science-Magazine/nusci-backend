export default class WritingStatus {
    static Needs_Editor = new AccountStatus("needs_editor");
    static Has_Editor = new AccountStatus("has_editor");
    static Rough_Draft_Complete = new AccountStatus("rough_draft_complete");
    static Edits_Complete = new AccountStatus("edits_complete");
    static Copy_Edits_Complete = new AccountStatus("copy_edits_complete");
    static Eic_Approved = new AccountStatus("eic_approved");
    static Dropped = new AccountStatus("dropped");


    /**
  static enum verification method
  * @param {String} str
  */
    static toAccountStatus(str) {
      switch (str.toLowerCase()) {
        case "needs_editor":
           return this.Needs_Editor;
        case "has_editor":
            return this.Has_Editor;
        case "rough_draft_complete":
            return this.Rough_Draft_Complete;
        case "edits_complete":
            return this.Edits_Complete;
        case "copy_edits_complete":
            return this.Copy_Edits_Complete;
        case "eic_approved":
            return this.Eic_Approved;
        case "dropped":
            return this.Dropped;
        default:

        }
    }
};
