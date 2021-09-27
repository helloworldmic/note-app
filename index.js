// in-built node modules
const fs = require("fs");
const path = require("path");
// NOM installed modules
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

//set up handlebars as view engine
const handlebars = require("express-handlebars");

app.engine("handlebars", handlebars({ defaultLayout: "main" })); // or main.handlebars?
app.set("view engine", "handlebars");

// const config = require("./stores/config.json")["development"];
const NoteService = require("./NoteService");
const NoteRouter = require("./Noterouter");

app.use(express.static("public")); // no longer get fr front-end if use backend, need to use this
//pas  the path to the folder
const noteService = new NoteService("data.json", fs); //not: path.join(__dirname)
const noteRouter = new NoteRouter(noteService);
//for post req
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Set up the NoteRouter - handle the requests and responses in the note, read from a file and return the actual data, get the note from your JSON file and return to the clients browser.
app.use("/api/info", noteRouter.router());
// app.get("/", (req, res, next) => {
//   console.log("Getting");
//   next();
// });
//for handlebars and land page route
app.get("/", (req, res) => {
  //  it means main.handlebars
  noteService.listNote("mich").then((data) => {
    //"mich"
    res.render("index", {
      user: "mich",
      notes: data,
    });
    console.log(data, "Getting in index.js");
  });
});
//for form submission: both get and post req
//create a new instance of noteService & pass file path/to/the/file where you want server to read from and write to
// app.get("/index", (req, res) => {  //changed from younotebook
//   res.render("index", { layout: "other" });
// });

// listen
app.listen(8080, () => {
  console.log("port 8080 is working");
});

module.exports = app; //why app?
