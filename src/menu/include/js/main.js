function restoreOptions(){
  chrome.storage.sync.get({
    incognitoMode: false
  }, function(items) {
    document.getElementById('regIncognitoMode').checked = items.incognitoMode;
  });
}

function saveChanges(data) {
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set(
    data,
    function() {
      console.log('Data saved.');
    }
  );
}

function init(){
  var incognitoModeCheckBox = document.getElementById('regIncognitoMode');
  incognitoModeCheckBox.onchange = function(){
    saveChanges( {incognitoMode: incognitoModeCheckBox.checked} );
    chrome.tabs.query({url: "*://*.instagram.com/*", currentWindow: true}, function(tabs) {
      tabs.forEach(
        function(tab) {
          chrome.tabs.update(tab.id, {url: tab.url});
        }
      );
    });
  };

  restoreOptions();
  document.getElementsByTagName('body')[0].style.opacity = 1;
  setTimeout(
    function(){
    }, 500
  );
}

window.onload = function(){
    init();
};
//document.addEventListener('DOMContentLoaded', init);
