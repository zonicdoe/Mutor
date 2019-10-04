/* Mutation observer for new media loading */
function hookMediaContainer(){
  // Media main container handler:
  var mediaContainer = document.getElementsByClassName(DOM_MEDIA_CONTAINER_CLASS)[0];
  if(mediaContainer != null){
    const mediaContainerObserver = new MutationObserver(
      function(mutations){
        if(mutations.length > 1){
          console.log('Media has been fetched.');
          // Renders toolbar for new loaded posts:
          renderPostControls(); // At posts.js
        }
      }
    );
    mediaContainerObserver.observe( mediaContainer, {childList: true, subtree: true} );
  }
}

/* Injects code for the controls in the profile page */
function renderProfileControls(){
  injectMediaViewer();
  renderPostControls(); // At posts.js
}
