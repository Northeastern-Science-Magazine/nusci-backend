// Test suites to log
export const log = {
  api: {
    article: {
      patchAuthors: false,
      patchStatus: false,
      postCommentCreate: false,
    },
    default: {
      default: false,
    },
    user: {
      getUsername: false,
      postLogin: false,
      postSignup: false,
      putResolveUser: false,
    },
    article: {},
    issueMap: {},
    photo: {},
    photoTag: {},
    calendarEvent: {},
  },
  integration: {
    user: {
      userSignUpFlow: false,
    },
  },
  unit: {
    enum: {
      accounts: false,
      accountStatus: false,
      articleContent: false,
      articleStatus: false,
      category: false,
      commentStatus: false,
      designStatus: false,
      photographyStatus: false,
      writingStatus: false,
    },
  },
};
