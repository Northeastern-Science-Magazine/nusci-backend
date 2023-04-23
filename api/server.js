import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pages from './routes/pages.route.js'
//import articles from './routes/articles.route.js'

/* We're gonna importing MongoDB and accessing it here with
ENVIRONMENT VARIABLES !!!! YAy
  */

//rename file to app.js
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

//Routing (Need to separate)
//base endpoint
// app.get('/', (req, res) => {
//     res.sendFile(path.resolve() + '/src/pages/HomePage/index.html');
// })

app.use('/', pages)
app.use('/articles', pages)
app.use('/authors', pages)

export default app;