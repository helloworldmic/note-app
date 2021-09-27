const express = require("express");

class NoteRouter {
  constructor(noteService) {
    this.noteService = noteService;
  }

  router() {
    let router = express.Router(); //why must inside router()
    router.get("/", this.get.bind(this));
    router.post("/", this.post.bind(this));
    router.put("/:index", this.put.bind(this)); //why /:index
    return router;
  }
  // -------------------------------------------------------------------------------
  get(req, res) {
    console.log("GET");
    return this.noteService // rmb to return
      .listNote("mich") //'mich'=req.auth.user
      .then((notes) => {
        console.log("get in noterouter");
        //console.log(notes);
        res.json(notes);
      })
      .catch((err) => {
        res.status(500).json(err);
        console.log(err);
      });
  }
  // -------------------------------------------------------------------------------
  post(req, res) {
    console.log("post in note-router");
    console.log(req.body.note, "mich"); //'mich'=req.auth.user
    return this.noteService
      .addNote(req.body.note, "mich") // =add in ans, 'mich'=req.auth.user
      .then(() => {
        console.log(req.body.note);
        return this.noteService
          .listNote("mich") // 'mich'=req.auth.user
          .then((notes) => {
            console.log(notes);
            return res.json(notes); // not res.send(notes);
            //rmb to return
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      });
  }
  // -------------------------------------------------------------------------------
  put(req, res) {
    console.log("put in noterouter");
    console.log(req.body.note, req.params.index, "mich");
    return this.noteService
      .editNote(req.params.index, req.body.note, "mich") //req.params.index ? 'mich'=req.auth.user
      .then(() => this.noteService.listNote("mich")) //what should put inside listNote()??????
      .then((notes) => {
        console.log("gotten inside put");
        res.json(notes); // or note? from req.body.note
        //why send a json as response??
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
}
module.exports = NoteRouter;
