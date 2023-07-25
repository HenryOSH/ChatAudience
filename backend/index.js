const express = require('express');
const multer = require('multer');
const openai = require('openai');
const cors = require('cors');

const app = express();
const port = 3000;

openai.apiKey = '';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());


app.post('/transcribe', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No audio file uploaded.');
  }

  try {
    const audioData = req.file.buffer;

    const response = await openai.speechToText(audioData);

    if (response && response.data && response.data.transcriptions) {
      res.json({ text: response.data.transcriptions[0].transcription });
    } else {
      res.status(500).send('Failed to transcribe audio.');
    }
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
