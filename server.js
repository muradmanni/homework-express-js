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
    res.status(200).json(JSON.parse(data));
  });
  
});

//Add new note in db route
app.post('/api/notes', (req, res) => {
  // Let the client know that their POST request was received
  //res.json(`${req.method} request received`);

  const {title, text} = req.body;
  let newNote = {
    id: uid.v1(),
    title: title,
    text: text
  }

  readAndWrite(newNote);  
  res.redirect('back');
});

  const readAndWrite = async (newNote) => {
  await readFileAsync('./db/db.json', 'utf8', (err, data) => {
    
    let noteArrayObject = JSON.parse(data);
    
    noteArrayObject.push(newNote)
    
    fs.writeFile(`./db/db.json`,JSON.stringify(noteArrayObject), (err) =>{
      err
        ? console.error(err)
        : console.log(
            `Note has been written to JSON file`
          )
    });
    
  })
  
}

app.delete("/api/notes/:id", async (req, res) => {
  await readFileAsync('./db/db.json', 'utf8', (err, data) => {
    const idToDelete= req.params.id;

    const oldNoteArrayObject = JSON.parse(data);
    const newNoteArrayObject = oldNoteArrayObject.filter(note => note.id !== idToDelete)
    

    fs.writeFile(`./db/db.json`,JSON.stringify(newNoteArrayObject), (err) =>{
      err
        ? console.error(err)
        : console.log(
            `Note removed from JSON file`
          )
    });
    res.redirect('back');
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
