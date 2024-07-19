import CommentStatus from "../enums/comment_status.js";

export class InternalCommentCreate extends BaseModel {
    static schema = {
        user: { type: UserPublicResponse.schema },
        comment: { type: string, required: true },
        commentStatus: { type: string, default: CommentStatus.Unresolved, override: true },
        creationTime: { type: date, default: now, override: true },
        modificationTime: { type: date, default: now, override: true },
    };
    constructor(json) {
        super(json, InternalCommentCreate.schema);
    }
}    
