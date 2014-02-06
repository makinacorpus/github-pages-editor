var tabs = [];

chrome.browserAction.onClicked.addListener(function(tab) {
  var sites = [];
  if(localStorage["sites"]) {
    sites = JSON.parse(localStorage["sites"]);
  }
  var valid = false;
  var site = [];
  for(var i=0;i<sites.length;i++) {
    if(tab.url.indexOf(sites[i][3])==0) {
      valid = true;
      site = sites[i];
    }
  }
  if(valid) {
    tabs[tab.id].port.postMessage({
      toggleEditor : true,
      options : {
        skin : "kama",
        toolbar : "CustomFull",
        account: localStorage['account'],
        password: localStorage['password'],
        user: site[0],
        repository: site[1],
        branch: site[2],
        website: site[3]
      }
    });
  } else {
    alert("This website is not declared in your GitHub Pages Editor settings.");
  }
});

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    if (msg.init)
      tabs[port.sender.tab.id] = {
        port : port
      };
    });
});

chrome.tabs.onRemoved.addListener(function(tabId) {
  if (tabs[tabId]) delete tabs[tabId];
});