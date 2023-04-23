import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pages from './routes/pages.route.js'
//import articles from './routes/articles.route.js'

//rename file to app.js
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/', pages)
app.use('/articles', pages)
app.use('/authors', pages)

export default app;