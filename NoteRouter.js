const express = require("express");

class NoteRouter {
  constructor(noteService) {
    this.noteService = noteService;
  }

  router() {
    let router = express.Router(); //why must inside router()
    router.get("/", this.get.bind(this));
    router.post("/", this.post.bind(this));
    router.put("/:index", this.put.bind(this)); //why /:index   check routing params
    return router;
  }
  // -------------------------------------------------------------------------------
  get(req, res) {
    console.log("GET");
    return this.noteService // rmb to return
      .listNote()
      .then((notes) => {
        res.json(notes);
      })
      .catch((err) => {
        res.status(500).json(err);
        console.log(err);
      });
  }
  // -------------------------------------------------------------------------------
  post(req, res) {
    console.log("posting data");
    console.log(req.body.notes);
    return this.noteService
      .addNote(req.body.notes) // =add in ans
      .then(() => {
        console.log(req.body.notes);
        return this.noteService
          .listNote()
          .then((notes) => {
            //=list in ans
            // rmb to return
            console.log(notes);
            return res.json(notes); // not res.send(notes);
            //rmb to return
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      });
  }

  put(req, res) {
    console.log("put request performing");
    console.log(req.body.notes, req.params.index);
    return this.noteService
      .editNote(req.body.notes, req.params.index)
      .then(() => {
        //rmb to return
        console.log("gotten here");
         this.noteService.listNote().then((notes) => {
          res.json(notes); // why send a json as response??
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
}
module.exports = NoteRouter;
