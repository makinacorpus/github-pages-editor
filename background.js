var tabs = [];

chrome.browserAction.onClicked.addListener(function(tab) {
  if(tab.url.indexOf(localStorage['website'])==0) {
    tabs[tab.id].port.postMessage({
      toggleEditor : true,
      options : {
        skin : "kama",
        toolbar : "CustomFull",
        account: localStorage['account'],
        password: localStorage['password'],
        user: localStorage['user'],
        repository: localStorage['repository'],
        branch: localStorage['branch'],
        website: localStorage['website']
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