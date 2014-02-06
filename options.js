// Saves options to localStorage.
function save_options() {
  localStorage["account"] = document.getElementById("field-account").value;
  localStorage["password"] = document.getElementById("field-password").value;
  user_fields = document.querySelectorAll("input[name='user']");
  repository_fields = document.querySelectorAll("input[name='repository']");
  branch_fields = document.querySelectorAll("input[name='branch']");
  website_fields = document.querySelectorAll("input[name='website']");
  var sites = [];
  for(var i=0; i<user_fields.length; i++) {
    var user = user_fields[i].value;
    if(user) {
      var repository = repository_fields[i].value;
      var branch = branch_fields[i].value;
      var website = website_fields[i].value;
      if(website[website.length - 1]!="/") {
        website += "/";
      }
      sites[i] = [user, repository, branch, website];
    }
  }
  localStorage["sites"] = JSON.stringify(sites);

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores values from localStorage.
function restore_options() {
  var sites = [];
  if(localStorage["sites"]) {
    sites = JSON.parse(localStorage["sites"]);
  }
  for(var i=0;i<sites.length+1;i++) {
    add_row();
  }
  document.getElementById("field-account").value = localStorage["account"];
  document.getElementById("field-password").value = localStorage["password"];
  user_fields = document.querySelectorAll("input[name='user']");
  repository_fields = document.querySelectorAll("input[name='repository']");
  branch_fields = document.querySelectorAll("input[name='branch']");
  website_fields = document.querySelectorAll("input[name='website']");

  for(var i=0; i<localStorage["sites"].length; i++) {
    user_fields[i].value = sites[i][0];
    repository_fields[i].value = sites[i][1];
    branch_fields[i].value = sites[i][2];
    website_fields[i].value = sites[i][3];
  }
}

// add a new blank row
function add_row() {
  document.querySelector("#sites").innerHTML += document.querySelector('#template').innerHTML;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
document.querySelector('#add').addEventListener('click', add_row);
