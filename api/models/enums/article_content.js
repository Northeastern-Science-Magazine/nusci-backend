export default class ArticleContent {
  static BodyParagraph = new ArticleContent("body_paragraph");
  static PullQuote = new ArticleContent("pull_quote");
  static Image = new ArticleContent("image");

  // get all Article Content types
  static list = [this.BodyParagraph, this.PullQuote, this.Image];
  static listStr = this.list.map((type) => {
    return type.type;
  });

  /**
   * INTERNAL USE ONLY
   *
   * Constrict an ArticleContent enum
   *
   * @param {String} type
   */
  constructor(type) {
    this.type = type;
  }

  /**
   * String to its associated ArticleContent object
   *
   * @param {String} str
   * @returns {ArticleContent}
   */
  static toArticleContent(str) {
    switch (str.toLowerCase()) {
      case this.BodyParagraph.type:
        return this.BodyParagraph;
      case this.PullQuote.type:
        return this.PullQuote;
      case this.Image.type:
        return this.Image;
      default:
    }
  }
}
