export default class ArticleContent {
  static BodyParagraph = new ArticleContent("body_paragraph");
  static PullQuote = new ArticleContent("pull_quote");
  static Image = new ArticleContent("image");

  static list = [this.BodyParagraph, this.PullQuote, this.Image];
  static listStr = this.list.map((type) => {
    return type.type;
  });

  constructor(type) {
    this.type = type;
  }

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
