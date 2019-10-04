var mediaViewer; // Player handler

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
  //
  mediaViewer = new modal(OVERLAY_ID, MODAL_ID);
  renderControls(document.location.href);
};
