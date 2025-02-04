const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cors = require('cors');

app.use(cors()); // Allow CORS for all origins


const app = express();
app.use(cors()); // Allow CORS for all origins
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve your front-end files

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    const fileName = req.file.originalname;

    try {
        let base64Encoded = '';
        
        // Encode PDF or DOCX file to Base64
        if (fileType === 'application/pdf') {
            const fileBuffer = await fs.readFile(filePath);
            base64Encoded = fileBuffer.toString('base64');
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const fileBuffer = await fs.readFile(filePath);
            base64Encoded = fileBuffer.toString('base64');
        } else {
            return res.status(400).json({ error: 'Unsupported file type. Only PDF or DOCX files are allowed.' });
        }

        // Delete temporary file after processing
        await fs.unlink(filePath);

        res.json({ fileName, encodedFile: base64Encoded });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Error processing the file.' });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
