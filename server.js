const express = require('express');
const path = require('path');
const notes = require('./db/db.json');
const fs = require('fs');
const util = require('util');
const uid = require("uuid");

const PORT = process.env.PORT || 3001;
const readFileAsync = util.promisify(fs.readFile);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (error, data) => {
    console.log(data);
    res.status(200).json(JSON.parse(data));
  });
  
});

app.post('/api/notes', (req, res) => {
  // Let the client know that their POST request was received
  res.json(`${req.method} request received`);

  const {title, text} = req.body;
  let newNote = {
    id: uid.v1(),
    title: title,
    text: text
  }

  run(newNote);  
  res.redirect('back');
});

const run = async (newNote) => {
  const res = await readFileAsync('./db/db.json', 'utf8', (err, data) => {
    console.log("DATA: ", data);
    
    let noteArrayObject = JSON.parse(data);
    
    noteArrayObject.push(newNote)
    
    fs.writeFile(`./db/db.json`,JSON.stringify(noteArrayObject), (err) =>{
      err
        ? console.error(err)
        : console.log(
            `Review for  has been written to JSON file`
          )
    });
    
  })
  
}



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
