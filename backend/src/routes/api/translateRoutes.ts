// backend/src/routes/translate.ts
import express from 'express';
import fetch from 'node-fetch-native';

const app = express.Router();

app.post('/', async (req, res) => { // ⚡ root here
    try {
        const { text, target, source } = req.body;
        const response = await fetch('http://localhost:5000/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: text, target, source: source || 'en' }),
        });

        const data = await response.json();
        res.json({ translatedText: data.translatedText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Translation failed' });
    }
});

export default app;
