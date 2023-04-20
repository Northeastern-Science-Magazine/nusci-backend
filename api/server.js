import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

//Routing (Need to separate)
//base endpoint
app.get('/', (req, res) => {
    res.sendFile(path.resolve() + '/src/pages/HomePage/index.html');
})

//authors endpoint
app.get('/authors', (req, res) => {
    res.sendFile(path.resolve() + '/src/pages/Authors/authors.html');
})

//authors endpoint
app.get('/articles', (req, res) => {
    res.sendFile(path.resolve() + '/src/pages/Articles/articles.html');
})

export default app;