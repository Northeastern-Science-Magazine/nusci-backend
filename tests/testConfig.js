// Test suites to log
export const log = {
  api: {
    article: {
      patchAuthors: false,
      patchResolveComment: false,
      patchStatus: false,
      postCommentCreate: false,
      getSearch: false,
    },
    default: {
      default: false,
    },
    user: {
      getEmail: false,
      postLogin: false,
      postSignup: false,
      putResolveUser: false,
    },
    article: {},
    issueMap: {
      patchRemoveArticle: false,
    },
    photo: {},
    photoTag: {},
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
