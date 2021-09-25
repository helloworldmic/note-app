var notesTemplate = Handlebars.compile();
const reloadNotes = (notes) => {
  console.log("RELOADING");
  $("#notes").html(notesTemplate({ notes: notes }));
};

const beginSaving = (target) => {
  $(target).prop("disabled", true);
  $(".saving").show();
};
const endSaving = (target) => {
  $(target).prop("disabled", true);
  $(".saving").hide();
};
$(() => {
  $("#add").submit((e) => {
    e.preventDefault();
    console.log("keydown to add");
    console.log("added a note");

    var val = $("textarea[name=note]").val();
    console.log(val);
    if (val === "") {
      return;
    }
    $("textarea[name=note]").val("");
    axios
      .post("/api/info", {
        //former: /api/notes, when test via postmen, use /api/info
        note: val,
      })
      .then((res) => {
        console.log(res, "<<<res");
        console.log(res.data, "<<<res.data");
        reloadNotes(res.data);
      })
      .catch((err) => {
        console.log(err);
        window.location.reload();
      });
  });

  $("#notes").on("blur", "textarea", (event) => {
    beginSaving(event.currentTarget);
    console.log($(event.currentTarget).data("horse"));
    console.log($(event.currentTarget).data("id"));

    axios
      .put("/api/info" + $(event.currentTarget).data("id"), {
        note: $(event.currentTarget).val(),
      })
      .then((res) => {
        endSaving(event.currentTarget);
        reloadNotes(res.data);
      })
      .catch((e) => {
        endSaving(event.currentTarget);
        alert(e);
      });
  });

  $("#notes").on("click", ".remove", (event) => {
    beginSaving(event.currentTarget);
    console.log($(event.currentTarget).data("id"));
    axios
      .delete("/api/info" + $(event.currentTarget).data("id"))
      .then((res) => {
        endSaving(event.currentTarget);
        reloadNotes(res.data);
      })
      .catch((e) => {
        endSaving(e.currentTarget);
        alert(e);
      });
  });
});
