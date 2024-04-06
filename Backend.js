const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const fileExists = (fileName) => {
  return fs.existsSync(`./files/${fileName}`);
};


app.post('/createFile', (req, res) => {
  const { filename, content, password } = req.body;

  if (!filename || !content) {
    return res.status(400).send('Missing filename or content');
  }
  if (fileExists(filename)) {
    return res.status(400).send('File already exists');
  }
  fs.writeFile(`./files/${filename}`, content, (err) => {
    if (err) {
      return res.status(500).send('Error saving file');
    }
    res.status(200).send('File created successfully');
  });
});

app.get('/getFiles', (req, res) => {
  fs.readdir('./files', (err, files) => {
    if (err) {
      return res.status(500).send('Error reading files');
    }
    res.json(files);
  });
});

app.get('/getFile', (req, res) => {
  const { filename } = req.query;
  if (!filename) {
    return res.status(400).send('Missing filename');
  }
  if (!fileExists(filename)) {
    return res.status(400).send('File not found');
  }
  fs.readFile(`./files/${filename}`, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
