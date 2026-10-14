// Test suites to log
export const log = {
  api: {
    article: {
      patchArticleContent: false,
      patchAuthors: false,
      patchResolveComment: false,
      patchStatus: false,
      patchTitle: false,
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
    issueMap: {
      patchRemoveArticle: false,
      patchCreateAddArticleToMap: false,
    },
    photo: {},
    photoTag: {
      postCreatePhotoTag: false,
    },
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