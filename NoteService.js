const fs = require("fs");
const app = require(".");

class NoteService {
  constructor(file) {
    this.file = file;
    this.notes = [];
    this.init();
  }
  init() {
    let notes = fs.readFileSync(__dirname + this.file, "utf-8");
    console.log(notes, "      <<<<<<<< before parsing");
    this.notes = JSON.parse(notes);
    console.log(this.notes, "<<<<<after parsing");
  }
  write(string) {
    return new Promise((resolve, reject) => {
      fs.writeFile(__dirname + this.file, string, (err) => {
        if (err) {
          reject(err);
        }
        resolve(this.file);
      });
    });
  }
  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(__dirname + this.file, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  addNote(note) {
    //note = newly input note, notes= read from file, this.notes=notes push into array
    this.init();
    console.log(this.notes);
    this.notes.push(note);
    let string = JSON.stringify(this.notes);
    return this.write(string);
  }
  listNote() {
    console.log("list?");
    // why no need arg, bcoz in app.js has 'notes'as arg?
    return this.read().then((notes) => {
      let parsedFile = JSON.parse(notes); //why note this.file?
      return parsedFile;
    });
  }
  editNote(note, index) {
    console.log(note, index, "label"); //should add a string to label so that it's easier to identify
    this.init(); // why no need return sth?
    console.log(this.notes, "<<before edit");
    this.notes[index] = note;
    console.log(this.notes[index], "the reason for failing.");
    let edited = JSON.stringify(this.notes); // should use string, not parsed??
    return this.write(edited);
  }
}

module.exports=NoteService
