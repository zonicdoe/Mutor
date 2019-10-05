var mediaViewer; // Player handler
// Configuration:
var config = {
	incognitoMode: false,
	unprotected: false
};

/* Gets _sharedData variable content: */
function getViewerData(){
	window.dispatchEvent(new Event(EVENT_GET_SHARED_DATA));
}

/* Injects modal player for fullscreen view */
function injectMediaViewer(){
	var pageContainer = document.getElementsByClassName(DOM_PAGE_CONTAINER_CLASS)[0];
  if(pageContainer != null){
    pageContainer.prepend( document.createElement('div') );
    pageContainer.childNodes[0].id = OVERLAY_ID;
    pageContainer.childNodes[0].appendChild( document.createElement('div') );
    pageContainer.childNodes[0].childNodes[0].id = MODAL_ID;
  }
}

/* Mutation observer for page changing */
function hookPage(){
  // Page container handler:
  var pageContainer = document.getElementById(DOM_SUPER_CONTAINER);
  if(pageContainer != null){
    const pageContainerObserver = new MutationObserver(
      function(mutations){
        for(var i = 0; i < mutations.length; i++){
          if(mutations[i].addedNodes.length > 0 && mutations[i].addedNodes[0].classList.contains(DOM_PAGE_CONTAINER_CLASS)){
            renderControls(document.location.href);
          }
        }
      }
    );
    pageContainerObserver.observe( pageContainer, {childList: true} );
  }

}

/* Render certain controls depending on the current page */
function renderControls(url){
	if(
		url.match(REGEX_PROFILE_URL) != null ||
		url.match(REGEX_PROFILE_TABS)
	){
    hookMediaContainer();
    renderProfileControls(); // At profile.js
	}
}

/* Process intercepted web response from Instagram: */
function processWebResponse(response){

}

/************************************************************************************
  Critical scripts injection.
*************************************************************************************/
/* Intercepts AJAX requests from instagram.
	 Prevents the view logging in Instagram stories (incognito mode)
	 and extracts visited profile's data */
const AJAXInterceptor = function AJAXInterceptor(ajaxEventName){
	var XHR = XMLHttpRequest.prototype;
  var send = XHR.send;
  var open = XHR.open;

  XHR.open = function(method, url) {
		var finalURL = url;
		if( finalURL.match(REGEX_REEL_INFO_JSON) != null){
			// Forces the request of current user's instagram stories:
			finalURL = finalURL.replace('include_reel%22%3Afalse', 'include_reel%22%3Atrue');
			arguments[1] = finalURL;
		}
    this.url = finalURL; // the request url
    return open.apply(this, arguments);
  }

  XHR.send = function(data) {
		// Intercepts AJAX response and proccess the response:
		this.addEventListener('load', function() {
			window.dispatchEvent(new CustomEvent(ajaxEventName, {
	      detail: {url: this.url, responseText: this.responseText}
	    }));
  	});

		// Blocks log request for storie views:
		if( this.url.match(REGEX_STORIES_VIEW_LOGGER) != null && _sharedData.config.incognito_mode){
			console.log('Blocking view logger...');
		}
		else{
			return send.apply(this, arguments);
		}

	};

	return true;
};

/* Extracts _sharedData variable and sends it to the app: */
const sharedDataExtractor = function addSharedDataExtractorListener(getEvent, sendEvent){
	window.addEventListener(getEvent, () => {
    window.dispatchEvent(new CustomEvent(sendEvent, {
      // eslint-disable-next-line no-underscore-dangle
      detail: window._sharedData,
    }));
  });
};

/* Injects critical scripts into the document's body: */
function injectScripts(){
	var script = document.createElement('script');
	script.id = DOM_EMBEDED_SCRIPTS;
  script.type = 'text/javascript';
  script.innerHTML = `
	const REGEX_REEL_INFO_JSON = ${REGEX_REEL_INFO_JSON};
	const REGEX_STORIES_VIEW_LOGGER = ${REGEX_STORIES_VIEW_LOGGER};
	_sharedData.config.incognito_mode = ${config.incognitoMode};

	${AJAXInterceptor}

	${sharedDataExtractor}

	if( AJAXInterceptor('${EVENT_AJAX_REQUEST}') ){
		window.dispatchEvent( new CustomEvent('${MSG_UNPROTECT_AVATAR}', {}) );
	}

	addSharedDataExtractorListener('${EVENT_GET_SHARED_DATA}', '${EVENT_SEND_SHARED_DATA}');
	`;
	document.head.prepend(script);
	console.log('Embeded scripts ready.');
}

/************************************************************************************
Message listeners
*************************************************************************************/
/* Unprotects current profile's avatar once it's safe
	 (interceptor script has alredy been injected) */
addEventListener(MSG_UNPROTECT_AVATAR,
	function(){
		config.unprotected = true;
		console.log('XMLHTTP requests methods overriden, unprotecting links...');
	}
);
// Injects critical scripts just after the DOM is loaded:
addEventListener("DOMContentLoaded", function() {
	injectScripts();
});
// Proccess response of AJAX request from Instagram:
addEventListener(EVENT_AJAX_REQUEST, function(response){
	processWebResponse(response.detail);
});
// Receives the _sharedData variable content and stores it:
window.addEventListener(EVENT_SEND_SHARED_DATA, function(response){
	loggedUser.userData.username = response.detail.config.viewer.username;
	loggedUser.userData.id = response.detail.config.viewer.id;
	loggedUser.userData.full_name = response.detail.config.viewer.full_name;
	loggedUser.userData.follows_viewer = false;
	loggedUser.userData.is_business_account = true;
});


chrome.storage.sync.get(
	{
		incognitoMode: false
	},
	function(items) {
			config.incognitoMode = items.incognitoMode
	}
);

window.onload = function(){
  hookPage(); // Checks page changing.
  // Renders current page controls:
  mediaViewer = new modal(OVERLAY_ID, MODAL_ID);
	getViewerData();
  renderControls(document.location.href);
};
