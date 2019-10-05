const IG_DOMAIN = 'instagram.com';
const IG_MOBILE_QUERY_SERVER = 'https://i.instagram.com/api/v1/';
const MOBILE_CHROME_USER_AGENT = 'Chrome/51.0.2704.81 Mobile Safari/537.36 Instagram 8.4.0';
const MSG_GET_BUSINESS_INFO = 'MSG_GET_BUSINESS_INFO';
const REGEX_DIRECT_TABS = /.*.instagram.com\/direct\/(inbox|t|new|requests)\/*/i;

class response{
  constructor(){
    this.status = 0;
    this.message = '';
    this.data = null;
  }
}

// Network filter for listen web request.
const networkFilter = { urls: ['*://*.instagram.com/*'] };
chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    if(
      details.url.match(REGEX_DIRECT_TABS) != null ||
      details.url.indexOf(IG_MOBILE_QUERY_SERVER) > -1
    ){
      console.log(details.url);
      for (var i = 0; i < details.requestHeaders.length; i++) {
        var name = details.requestHeaders[i].name.toLowerCase();
        if (name === "user-agent") {
          details.requestHeaders[i].value = MOBILE_CHROME_USER_AGENT;
          return {"requestHeaders": details.requestHeaders};
        }
      }
    }
  },
  networkFilter,
  ["blocking", "requestHeaders"]
);

function getBussinesInfo(userID){
	return new Promise(
		function(resolve, reject){
      var Http = new XMLHttpRequest();
      Http.open("GET", IG_MOBILE_QUERY_SERVER + 'users/' + userID + '/info/');
      Http.withCredentials = true;
      Http.send();
      Http.onreadystatechange = function() {
        if(this.readyState == 4){
          if(this.status == 200){
            var response = JSON.parse(Http.responseText);
            resolve(response.user);
          }
          else{
            reject(
              'Error while getting business info:\n' +
              'Instagram server responded with and error code: ' +
              this.status + '.'
            );
          }
        }
      }
		}
	);
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var res = new response();

    switch(request.command){
      case MSG_GET_BUSINESS_INFO:
      getBussinesInfo(request.userID).then(
        function(response){
          res.status = 1;
          res.message = 'Success.';
          res.data = response;
          sendResponse(res);
        }
      ).catch(
        function(error){
            res.message = error;
            sendResponse(res);
        }
      );
        break;
      default:
    }

    return true;
  }
);
