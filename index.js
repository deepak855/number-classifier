const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// File paths
const files = {
  A: path.join(__dirname, 'data', 'fileA.txt'),
  B: path.join(__dirname, 'data', 'fileB.txt'),
  C: path.join(__dirname, 'data', 'fileC.txt'),
  D: path.join(__dirname, 'data', 'fileD.txt')
};

// Helper function to check if all files have at least one entry
const checkAllFilesPopulated = () => {
  return Object.values(files).every(file => {
    return fs.existsSync(file) && fs.readFileSync(file, 'utf-8').trim().length > 0;
  });
};

// Endpoint to handle number input
app.post('/input-number', (req, res) => {
  const { number } = req.body;

  if (typeof number !== 'number' || number < 1 || number > 25) {
    return res.status(400).json({ error: 'Input must be a number between 1 and 25.' });
  }

  const result = number * 7;

  let fileKey;
  if (result > 140) {
    fileKey = 'A';
  } else if (result > 100) {
    fileKey = 'B';
  } else if (result > 60) {
    fileKey = 'C';
  } else {
    fileKey = 'D';
  }

  if (checkAllFilesPopulated()) {
    return res.status(400).json({ error: 'All files are already populated. No new entries allowed.' });
  }

  fs.appendFileSync(files[fileKey], `${result}\n`);
  res.json({ message: `Number ${number} multiplied by 7 and saved to file ${fileKey}.`, result });
});

// Endpoint to list all numbers in all files
app.get('/list-numbers', (req, res) => {
  const fileContents = {};
  for (const [key, filePath] of Object.entries(files)) {
    fileContents[key] = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8').trim().split('\n') : [];
  }
  res.json(fileContents);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

