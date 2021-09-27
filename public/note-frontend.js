var notesTemplate = Handlebars.compile(
  `{{#each notes}}
  <div class='note'>
   <span class='input'> <textarea data-horse ='pony' data-id='{{@index}}'> {{this}}</textarea> </span>
   <button class='remove btn btn-xs' data-id='{{@index}}> <i class ='fa fa-trash' aria-hidden='true'>
   </button> </div>
   {{/each}}
   `
);
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
    var val = $("textarea[name=note]").val();
    console.log(val); // 'add'
    if (val === "") {
      return;
    }
    $("textarea[name=note]").val("");
    axios
      .post("/api/info/", {
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
      .put("/api/info/" + `${$(event.currentTarget).data("id")}`, {
        note: $(event.currentTarget).val(),
      })
      .then((res) => {
        console.log(res);
        console.log("edit done");
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
