// Saves options to localStorage.
function save_options() {
  var fields = ["user", "repository", "branch", "account", "password", "website"];
  for(var i=0; i<fields.length; i++) {
    var field = document.getElementById("field-" + fields[i]);
    var value = field.value;
    if(fields[i]=="website") {
      if(value[value.length - 1]!="/") {
        value += "/";
      }
    }
    localStorage[fields[i]] = value;
  }

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores values from localStorage.
function restore_options() {
  var fields = ["user", "repository", "branch", "account", "password", "website"];
  for(var i=0; i<fields.length; i++) {
    var stored_value = localStorage[fields[i]];
    if(!stored_value && fields[i] == "branch") stored_value = "gh-pages";
    if(stored_value) {
      var field = document.getElementById("field-" + fields[i]);
      field.value = stored_value;
    }
  }
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
