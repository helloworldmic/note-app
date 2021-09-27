// const fs = require("fs");
// const app = require(".");

// const { prependListener } = require(".");

class NoteService {
  constructor(file, fs) {
    this.file = file;
    this.initPromise = null; //???
    this.fs = fs; //where will fs come from?
    this.init();
  }
  init() {
    if (this.initPromise === null) {
      //??????
      this.initPromise = new Promise((resolve, reject) => {
        this.read()
          .then(() => {
            resolve();
          })
          .catch(() => {
            this.notes = {};
            this.write().then(resolve).catch(reject);
          });
      });
      // let notes = fs.readFileSync(__dirname + this.file, "utf-8");
      // console.log(notes, "      <<<<<<<< before parsing");
      // this.notes = JSON.parse(notes);
      // console.log(this.notes, "<<<<<after parsing");
    }
    return this.initPromise;
  }
  write() {
    return new Promise((resolve, reject) => {
      console.log(this.notes, "<<<<<<<< NOTES WRITING ");
      this.fs.writeFile(this.file, JSON.stringify(this.notes), (err) => {
        if (err) {
          return reject(err);
        }
        console.log("writing");
        resolve(this.file);
      });
    });
  }
  read() {
    return new Promise((resolve, reject) => {
      this.fs.readFile(this.file, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        }
        try {
          this.notes = JSON.parse(data);
          console.log("reading in noteservice");
          console.log(this.notes);
        } catch (e) {
          return reject(e);
        }
        return resolve(this.notes);
      });
    });
  }
  listNote(user) {
    // added user
    // console.log("listing in noteservice");
    // // why no need arg, bcoz in app.js has 'notes'as arg?
    // return this.read().then((notes) => {
    //   let parsedFile = JSON.parse(notes); //why note this.file?
    //   console.log(this.notes, "inside listNote, after parsedFile");
    //   return parsedFile[user]; // added user
    // });
    console.log("inside this.listNote");
    if (typeof user !== "undefined") {
      return this.init()
        .then(() => {
          return this.read();
        })
        .then(() => {
          if (typeof this.notes[user] === "undefined") {
            return [];
          } else {
            console.log(this.notes[user], "succeed ");
            return this.notes[user]; //add[user]
          }
        });
    } else {
      return this.init().then(() => {
        return this.read();
      });
    }
  }

  addNote(note, user) {
    // added user
    //note = newly input note, notes= read from file, this.notes=notes push into array
    // this.init();
    // console.log(this.notes);
    // this.notes.push(note);
    // let string = JSON.stringify(this.notes);
    // return this.write(string);
    console.log(3);
    return this.init().then(() => {
      if (typeof this.notes[user] === "undefined") {
        // added user='mich'
        this.notes[user] = [];
      }
      console.log(this.notes, "<<<this.notes");
      this.notes[user].push(note); // added user
      console.log(this.notes[0], "<<<this.notes[0]");
      return this.write();
    });
  }

  editNote(index, note, user) {
    console.log(note);
    //update in ans

    // added user
    // console.log(note, index, "label"); //should add a string to label so that it's easier to identify
    // this.init();
    // console.log(this.notes, "<<before edit");
    // this.notes[index] = note;
    // console.log(this.notes[index], "the reason for failing.");
    // let edited = JSON.stringify(this.notes); // should use string, not parsed??
    // return this.write(edited);
    return this.init().then(() => {
      if (typeof this.notes[user] === "undefined") {
        throw new Error("cannot update a note, if the user doens't exist");
      }
      if (this.notes.length <= index) {
        throw new Error("can't update the note that doesn't exist");
      } else {
        this.notes[user][index] = note; // added user
        console.log(this.notes[user]);
        return this.write();
      }
    });
  }
}
module.exports = NoteService;
