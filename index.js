const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const path = require('path');

const app = express();
app.use(cors()); // Allow CORS for all origins

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    let content = '';
    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    try {
        if (fileType === 'application/pdf') {
            const data = await pdfParse(await fs.readFile(filePath));
            content = data.text;
        } else {
            return res.status(400).json({ error: 'Unsupported file type.' });
        }

        res.json({ content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing the file.' });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
