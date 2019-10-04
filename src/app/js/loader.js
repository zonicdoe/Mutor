var mediaViewer; // Player handler
// Configuration:
var config = {
	incognitoMode: false,
	unprotected: false
};
// Last profile visited:
var cachedProfile = {
	userData: {username: ''},
	businessInfo: null,
	reelInfo: {
		reel: {
			latest_reel_media: null
		}
	}
};

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
            console.log('Page has changed.');
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

window.onload = function(){
  hookPage(); // Checks page changing.
  // Renders current page controls:
  mediaViewer = new modal(OVERLAY_ID, MODAL_ID);
  renderControls(document.location.href);
};

/************************************************************************************
  Critical scripts injection.
*************************************************************************************/
/* Intercepts AJAX requests from instagram and prevents
 	 the view logging in Instagram stories (incognito mode) */
const AJAXInterceptor = function AJAXInterceptor(ajaxEventName){
	var XHR = XMLHttpRequest.prototype;
  var send = XHR.send;
  var open = XHR.open;

  XHR.open = function(method, url) {
    this.url = url; // the request url
    return open.apply(this, arguments);
  }

  XHR.send = function(data) {
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

function injectScripts(){
	var script = document.createElement('script');
	script.id = DOM_EMBEDED_SCRIPTS;
  script.type = 'text/javascript';
  script.innerHTML = `
	const REGEX_STORIES_VIEW_LOGGER = ${REGEX_STORIES_VIEW_LOGGER};
	_sharedData.config.incognito_mode = ${config.incognitoMode};

	${AJAXInterceptor}

	if( AJAXInterceptor('${EVENT_AJAX_REQUEST}') ){
		window.dispatchEvent( new CustomEvent('${MSG_UNPROTECT_AVATAR}', {}) );
	}
	`;
	document.head.prepend(script);
	console.log('Embeded scripts ready.');
}

/************************************************************************************
Message listeners
*************************************************************************************/
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


chrome.storage.sync.get(
	{
		incognitoMode: false
	},
	function(items) {
			config.incognitoMode = items.incognitoMode
	}
);
