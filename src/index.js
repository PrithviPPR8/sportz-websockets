import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
	res.json({ message: 'Hello from Express server' });
});

const PORT = 8000;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT} - URL: http://localhost:${PORT}/`);
});

