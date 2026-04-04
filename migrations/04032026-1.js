import MockConnection from "../tests/util/mockConnection.js";
import User from "../app/models/dbModels/user.js";
import Article from "../app/models/dbModels/article.js";

async function migrate() {
  await MockConnection.open();
  let totalArticlesModified = 0;
  let authorsWithArticles = 0;

  const users = User.find({});

  for (const user of users) {
    let articlesPerAuthor = 0;
    const name = `${user.firstName} ${user.lastName}`;
    const mongoId = user._id;

    const articlesByAuthor = await Article.find({ authors: name });
    for (const article of articlesByAuthor) {
      article.authors = [mongoId];
      article.save();
      articlesPerAuthor++;
    }

    console.log(`${name}: ${articlesPerAuthor}`);
  }

  console.log("\nTotal Articles Modified: ", totalArticlesModified);
  console.log("\nAuthors with Articles: ", authorsWithArticles);
}

await migrate();
