var tabs = [];

chrome.browserAction.onClicked.addListener(function(tab) {
  tabs[tab.id].port.postMessage({
    toggleEditor : true,
    options : {
      skin : "kama",
      toolbar : "CustomFull",
      account: localStorage['account'],
      password: localStorage['password'],
      user: localStorage['user'],
      repository: localStorage['repository'],
      branch: localStorage['branch']
    }
  });
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