import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/', (_req, res) => {
    res.sendFile(__dirname + '../client/index.html');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});